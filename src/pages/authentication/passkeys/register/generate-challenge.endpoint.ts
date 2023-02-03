import { generateRegistrationOptions } from '@simplewebauthn/server';

import prisma from '../../../../db/client.js';

export const route = '/register/generate-challenge';

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
    const magicLink = req.query.magicLink;
    if (!webAuthToken || !magicLink) return res.redirect('/login');

    const webAuth = await prisma.webAuthToken.findUnique({
      where: {
        token: webAuthToken,
      },
    });

    if (!webAuth) return res.redirect('/login');

    const magicLinkToken = await prisma.magicLink.findUnique({
      where: {
        token: magicLink,
      },
    });

    if (!magicLinkToken) return res.redirect('/login');

    const challenge = generateRegistrationOptions({
      rpName: 'SimpleWebAuthn',
      rpID: 'localhost',
      userID: webAuthToken,
      userName: webAuthToken,
      attestationType: 'direct',
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
