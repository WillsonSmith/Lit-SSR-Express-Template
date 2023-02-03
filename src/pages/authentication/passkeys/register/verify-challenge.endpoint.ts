import { verifyRegistrationResponse } from '@simplewebauthn/server';

import prisma from '../../../../db/client.js';

export const route = '/register/verify-challenge';

export const post = async (req, res) => {
  try {
    const webAuthToken = req.body.webAuthToken;
    const magicLink = req.body.magicLink;
    const webAuthTokenFromDB = await prisma.webAuthToken.findUnique({
      where: {
        token: webAuthToken,
      },
    });

    const challenge = await prisma.challenge.findUnique({
      where: {
        webAuthTokenId: webAuthTokenFromDB.id,
      },
    });
    if (!challenge) return res.redirect('/login');

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: challenge.challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
    });

    if (!verification.verified) return res.redirect('/login');
    if (!verification.registrationInfo) return res.redirect('/login');

    const { registrationInfo } = verification;

    const magicLinkFromDB = await prisma.magicLink.findUnique({
      where: {
        token: magicLink,
      },
    });

    if (magicLinkFromDB.userId) {
      // handle cases where registering a new authenticator for a user
      const user = await prisma.user.findUnique({
        where: {
          id: magicLinkFromDB.userId,
        },
      });

      await prisma.authenticators.create({
        data: {
          credentialID: Buffer.from(registrationInfo.credentialID).toString(
            'base64url'
          ),
          credentialPublicKey: Buffer.from(
            registrationInfo.credentialPublicKey
          ),
          counter: registrationInfo.counter,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: null,
        },
      });

      const sessionToken = await prisma.sessionToken.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      req.session.sessionToken = sessionToken.token;

      await prisma.webAuthToken.delete({
        where: {
          id: webAuthTokenFromDB.id,
        },
      });

      return res.status(200).json({ success: true });
    }

    const userRole = await prisma.role.findUnique({
      where: {
        name: 'USER',
      },
    });

    const newUser = await prisma.user.create({
      data: {
        authenticators: {
          create: {
            credentialID: Buffer.from(registrationInfo.credentialID).toString(
              'base64url'
            ),
            credentialPublicKey: Buffer.from(
              registrationInfo.credentialPublicKey
            ),
            counter: registrationInfo.counter,
          },
        },
        sessionTokens: {
          create: {},
        },
        roleId: userRole.id,
      },
      include: {
        sessionTokens: true,
      },
    });

    req.session.sessionToken = newUser.sessionTokens[0].token;

    await prisma.webAuthToken.delete({
      where: {
        id: webAuthTokenFromDB.id,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
