import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const permissions = async () => {
  return prisma.permission.findMany({
    include: { users: true },
  });
};
