import { generateAuthenticationOptions } from '@simplewebauthn/server';

import prisma from '../../../db/client.js';

export const route = '/login/challenge';
export const get = async (req, res) => {
  try {
    const webauthToken = req.session.webauthToken;
    await prisma.challenge.deleteMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    if (!webauthToken) return res.redirect('/login');

    const challenge = generateAuthenticationOptions({
      userVerification: 'preferred',
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
