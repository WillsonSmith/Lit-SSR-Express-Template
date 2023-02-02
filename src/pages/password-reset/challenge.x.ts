export const route = '/password-reset/challenge';

import prisma from '../../db/client.js';
import { generateRegistrationOptions } from '@simplewebauthn/server';

import { authenticationMiddleware } from '../../middleware/auth.js';
export const middleware = [authenticationMiddleware()];
export const get = async (req, res) => {
  const webauthToken = req.session.webauthToken;
  if (!webauthToken) return res.redirect('/');
  if (!req.user) return res.redirect('/admin/login');
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
    userName: req.user.name,
    attestationType: 'direct',
  });

  await prisma.challenge.create({
    data: {
      sessionToken: webauthToken,
      challenge: challenge.challenge,
    },
  });

  return res.status(200).json(challenge);
};
