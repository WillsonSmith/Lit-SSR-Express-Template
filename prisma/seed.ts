import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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
