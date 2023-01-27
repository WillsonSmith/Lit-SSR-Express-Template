import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      posts: {
        create: { title: 'Hello World', content: 'This is my first post' },
      },
    },
  });
}

main();
