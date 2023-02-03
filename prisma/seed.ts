import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.magicLink.create({
    data: {
      token: '123',
      // expires in 999 years
      expiresAt: new Date(Date.now() + 999 * 365 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  });
  await prisma.role.create({
    data: {
      name: 'USER',
    },
  });

  await prisma.permission.create({
    data: {
      name: 'ADMIN_DASHBOARD',
      roles: {
        connect: {
          name: 'ADMIN',
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Willson',
      password: 'password',
      role: {
        connect: {
          name: 'ADMIN',
        },
      },
    },
  });
}

main();
