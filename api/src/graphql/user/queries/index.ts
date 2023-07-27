import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const allUsers = async () => {
  const result = await prisma.user.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  const response = result.map((u) => ({
    ...u,
    permissions: u.permissions.map((p) => ({ ...p.permission })),
  }));
  return response;
};

export const findUserById = async (_: any, { id }: { id: number }) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { permissions: { include: { permission: true } } },
  });

  if (user) {
    return {
      ...user,
      permissions: user.permissions.map((p) => ({ ...p.permission })),
    };
  }

  return null;
};
