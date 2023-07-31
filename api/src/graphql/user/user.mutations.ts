import { Prisma, PrismaClient } from "@prisma/client";

// const url = process.env.ENVIRONMENT === 'dev' ? process.env.DATABASE_URL_TESTM : process.env.DATABASE_URL;
const prisma = new PrismaClient();

export const createUser = async (
  _: any,
  { data }: { data: Prisma.UserCreateInput }
) => {
  console.log(data);
  const user = await prisma.user.create({
    data,
  });

  return user;
};
export const updateUser = async (
  _: any,
  { data: { id }, data }: { data: Prisma.UserUpdateInput & { id: string } }
) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return user;
};
export const deleteUser = async (_: any, { id }: { id: string }) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return user;
};
