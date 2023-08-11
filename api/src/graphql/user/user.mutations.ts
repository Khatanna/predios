import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (
  _: any,
  { data }: { data: Prisma.UserCreateInput }
) => {
  const password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password },
  });

  return user;
};
export const updateUserById = async (_parent: any, { data: { id, data } }: { data: { id: string, data: Prisma.UserUpdateInput } }) => {
  const user = await prisma.user.update({
    where: {
      id
    }, data
  })

  return {
    updated: Boolean(user),
    user
  }
};

export const updateUserByUsername = async (_parent: any, { data: { username, data } }: { data: { username: string, data: Prisma.UserUpdateInput } }) => {
  const user = await prisma.user.update({
    where: {
      username
    }, data
  })

  return {
    updated: Boolean(user),
    user
  }
};

export const deleteUserById = async (_: any, { id }: { id: string }) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return { deleted: Boolean(user), user };
};

export const deleteUserByUsername = async (_: any, { username }: { username: string }) => {
  const user = await prisma.user.delete({
    where: {
      username
    }
  })
  return { deleted: Boolean(user), user };
}