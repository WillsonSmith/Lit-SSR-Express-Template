export const route = '/password-reset/challenge';

import prisma from '../../db/client.js';
import { generateRegistrationOptions } from '@simplewebauthn/server';

import { authenticate } from '../../middleware/auth.js';
export const middleware = [authenticate()];
export const get = async (req, res) => {
  const webauthToken = req.session.webauthToken;
  if (!webauthToken) return res.redirect('/');

  console.log('pccm1', req.user);

  if (!req.user) return res.redirect('/admin/login');

  console.log('pccm');

  await prisma.challenge.deleteMany({
    where: {
      createdAt: {
        lte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
  });

  console.log('pccm2');

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
