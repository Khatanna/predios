import { PrismaClient } from "@prisma/client";

export const updateRefreshToken = (
  username: string,
  token: string,
  prisma: PrismaClient,
) => {
  return prisma.user.update({
    where: {
      username,
    },
    data: {
      session: {
        upsert: {
          where: {
            user: {
              username,
            },
          },
          update: {
            token,
          },
          create: {
            token,
          },
        },
      },
    },
  });
};
