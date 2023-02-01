import { verifyRegistrationResponse } from '@simplewebauthn/server';
import prisma from '../../db/client.js';

export const route = '/password-reset/verify';

import { authenticate } from '../../middleware/auth.js';
export const middleware = [authenticate()];
export const post = async (req, res) => {
  console.log('test');
  await prisma.challenge.deleteMany({
    where: {
      createdAt: {
        lte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
  });
  const webauthToken = req.session.webauthToken;
  if (!webauthToken) return res.redirect('/');
  if (!req.user) return res.redirect('/admin/login');

  const challenge = await prisma.challenge.findUnique({
    where: {
      sessionToken: webauthToken,
    },
  });
  if (!challenge) return res.redirect('/admin/login');

  const verification = await verifyRegistrationResponse({
    response: req.body,
    expectedChallenge: challenge.challenge,
    expectedOrigin: 'http://localhost:3000',
    expectedRPID: 'localhost',
  });

  if (!verification.verified) return res.redirect('/admin/login');

  if (!verification.registrationInfo) return res.redirect('/admin/login');

  const { registrationInfo } = verification;

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
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
      password: null,
    },
  });

  req.session.authenticated = true;
  req.session.user = {
    id: updatedUser.id,
    name: updatedUser.name,
  };

  await prisma.challenge.deleteMany({
    where: {
      sessionToken: webauthToken,
    },
  });

  return res.status(200).json({ success: true });
};
