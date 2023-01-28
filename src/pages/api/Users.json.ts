import prisma from '../../db/client.js';
export const route = '/api/users.json';
export const get = async (_, res) => {
  const users = await prisma.user.findMany();
  res.json({ data: { users } });
};
