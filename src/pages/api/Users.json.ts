import prisma from '../../db/client.js';
export const route = '/api/users.json';
export const get = async (_, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
  res.json({ data: { users } });
};

import { requiresPermissionMiddleware } from '../../middleware/auth.js';
export const middleware = [
  requiresPermissionMiddleware('ADMIN', {
    unauthorizedRedirect: '/',
  }),
];
