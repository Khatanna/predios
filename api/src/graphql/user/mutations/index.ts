import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (
  _: any,
  { data }: { data: Prisma.UserCreateInput }
) => {
  const user = await prisma.user.create({
    data,
  });

  return user;
};
export const updateUser = async (
  _: any,
  { data: { id }, data }: { data: Prisma.UserUpdateInput & { id: number } }
) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return user;
};
export const deleteUser = async (_: any, { id }: { id: number }) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return user;
};
