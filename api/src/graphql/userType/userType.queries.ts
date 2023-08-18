import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getAllUserTypes = () => {
  return prisma.userType.findMany({ orderBy: { createdAt: 'asc' }, include: { users: true } })
} 