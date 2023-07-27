import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const permissions = async () => {
  return prisma.permission.findMany();
};

export const permissionsWithUsers = async () => {
  const permissions = await prisma.permission.findMany({
    include: { users: { include: { user: true } } },
  });
  return permissions.map((p) => ({
    ...p,
    users: p.users.map((u) => ({ ...u.user })),
  }));
};
