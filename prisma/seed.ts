import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      password: 'password',
      role: {
        connectOrCreate: {
          where: {
            name: 'ADMIN',
          },
          create: {
            name: 'ADMIN',
          },
        },
      },
    },
  });
}

main();
