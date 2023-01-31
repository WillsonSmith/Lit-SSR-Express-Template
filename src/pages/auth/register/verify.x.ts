import { verifyRegistrationResponse } from '@simplewebauthn/server';

import prisma from '../../../db/client.js';

export const route = '/register/verify';
export const post = async (req, res) => {
  await prisma.challenge.deleteMany({
    where: {
      createdAt: {
        lte: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
  });

  const webauthToken = req.session.webauthToken;
  const challenge = await prisma.challenge.findUnique({
    where: {
      sessionToken: webauthToken,
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
    },
    include: {
      sessionTokens: true,
    },
  });

  req.session.authenticated = true;
  req.session.user = {
    id: newUser.id,
    name: newUser.name,
  };
  req.session.sessionToken = newUser.sessionTokens[0].token;

  await prisma.challenge.delete({
    where: {
      sessionToken: webauthToken,
    },
  });
  return res.status(200).json({ success: true });
};
