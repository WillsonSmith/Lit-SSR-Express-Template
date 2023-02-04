import { generateAuthenticationOptions } from '@simplewebauthn/server';
export const route = '/login/generate-challenge';

import prisma from '../../../../db/client.js';
import { whereCreatedFiveMinutesAgo } from '../../../../db/queries.js';
export const get = async (req, res) => {
  try {
    await prisma.webAuthToken.deleteMany(whereCreatedFiveMinutesAgo);
    await prisma.challenge.deleteMany(whereCreatedFiveMinutesAgo);

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
