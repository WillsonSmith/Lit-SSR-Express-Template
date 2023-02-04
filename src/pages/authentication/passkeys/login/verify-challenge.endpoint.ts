import { verifyAuthenticationResponse } from '@simplewebauthn/server';

import prisma from '../../../../db/client.js';

export const route = '/login/verify';

export const post = async (req, res) => {
  try {
    const webAuthToken = req.body.webAuthToken;
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

    const authenticator = await prisma.authenticators.findUnique({
      where: {
        credentialID: req.body.id,
      },
    });
    if (!authenticator) return res.redirect('/login');

    const verification = await verifyAuthenticationResponse({
      authenticator: {
        credentialPublicKey: authenticator.credentialPublicKey,
        credentialID: new Uint8Array(Buffer.from(authenticator.credentialID)),
        counter: authenticator.counter,
      },
      response: req.body,
      requireUserVerification: true,
      expectedChallenge: challenge.challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
    });
    if (!verification.verified) return res.redirect('/login');

    const newSessionToken = await prisma.sessionToken.create({
      data: {
        user: {
          connect: {
            id: authenticator.userId,
          },
        },
      },
    });

    req.session.sessionToken = newSessionToken.token;

    await prisma.authenticators.update({
      where: {
        id: authenticator.id,
      },
      data: {
        counter: verification.authenticationInfo.newCounter,
      },
    });

    await prisma.webAuthToken.delete({
      where: {
        token: webAuthToken,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
