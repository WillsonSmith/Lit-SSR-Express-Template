import { Prisma } from '@prisma/client';

const userWithRole = Prisma.validator<Prisma.UserArgs>()({
  include: {
    role: true,
  },
});

export type UserWithRole = Prisma.UserGetPayload<typeof userWithRole>;
