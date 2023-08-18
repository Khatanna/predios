import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { GraphQLError } from "graphql";
import { Code, Status } from "../../constants";

const prisma = new PrismaClient();

export const createUser = async (
  _: any,
  { data }: { data: Prisma.UserCreateInput & { type: { name: string } } }
) => {
  try {
    const password = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { ...data, type: { connect: { name: data.type.name } }, password },
    });

    return { created: Boolean(user), user };
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new GraphQLError(e.code === "P2002" ? "Este usuario ya existe" : e.message, {
        extensions: {
          code: Code.INTERNAL_SERVER_ERROR,
          http: { status: Status.INTERNAL_SERVER_ERROR },
        }
      })
    }
  }
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

export const updateUserByUsername = async (_parent: any, { data: { username, data } }: { data: { username: string, data: Prisma.UserUpdateInput & { type: { name: string } } } }) => {
  console.log(data);
  const user = await prisma.user.update({
    where: {
      username
    }, data: {
      ...data, type: {
        connect: {
          name: data.type.name
        }
      }
    }
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
  try {
    const user = await prisma.user.delete({
      where: {
        username
      }
    })
    return { deleted: Boolean(user), user };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code)
      throw new GraphQLError(e.code === 'P2025' ? "Usuario no encontrado" : e.message, {
        extensions: {
          code: Code.BAD_REQUEST,
          http: { status: Status.BAD_REQUEST }
        }
      })

    }

    throw new GraphQLError("Error del servidor", {
      extensions: {
        code: Code.INTERNAL_SERVER_ERROR,
        http: { status: Status.INTERNAL_SERVER_ERROR }
      }
    })
  }
}