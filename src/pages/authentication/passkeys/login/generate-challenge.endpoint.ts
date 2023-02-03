import { generateAuthenticationOptions } from '@simplewebauthn/server';

import prisma from '../../../../db/client.js';

export const route = '/login/generate-challenge';
export const get = async (req, res) => {
  try {
    await prisma.webAuthToken.deleteMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });
    await prisma.challenge.deleteMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });
    const webAuthToken = req.query.webAuthToken;
    if (!webAuthToken) return res.redirect('/login');

    const webAuth = await prisma.webAuthToken.findUnique({
      where: {
        token: webAuthToken,
      },
    });

    if (!webAuth) return res.redirect('/login');

    const challenge = generateAuthenticationOptions({
      userVerification: 'preferred',
    });

    await prisma.challenge.create({
      data: {
        challenge: challenge.challenge,
        webAuthToken: {
          connect: {
            token: webAuthToken,
          },
        },
      },
    });

    res.status(200).json(challenge);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
