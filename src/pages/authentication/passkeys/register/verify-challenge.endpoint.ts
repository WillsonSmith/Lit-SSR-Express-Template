import { verifyRegistrationResponse } from '@simplewebauthn/server';

import prisma from '../../../../db/client.js';

export const route = '/register/verify-challenge';

export const post = async (req, res) => {
  try {
    const webAuthToken = req.body.webAuthToken;
    console.log(webAuthToken);
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
