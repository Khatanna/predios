import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllPermissions = async () => {
  return prisma.permission.findMany({
    include: { users: true },
    orderBy: { createdAt: 'asc' }
  });
};

export const getPermissionByName = async (_parent: any, { name }: { name: string }) => {
  return prisma.permission.findMany({
    where: { name },
    select: { name: true }
  })
}