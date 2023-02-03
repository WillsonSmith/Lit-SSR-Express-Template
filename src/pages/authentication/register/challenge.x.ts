import { generateRegistrationOptions } from '@simplewebauthn/server';

import prisma from '../../../db/client.js';

export const route = '/register/challenge';
export const get = async (req, res) => {
  try {
    const webauthToken = req.session.webauthToken;
    if (!webauthToken) return res.redirect('/login');
    await prisma.challenge.deleteMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    const userId = crypto.randomUUID();
    const challenge = generateRegistrationOptions({
      rpName: 'SimpleWebAuthn',
      rpID: 'localhost',
      userID: userId,
      userName: userId,
      attestationType: 'direct',
    });

    await prisma.challenge.create({
      data: {
        sessionToken: webauthToken,
        challenge: challenge.challenge,
      },
    });

    return res.status(200).json(challenge);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
