import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { Code, Status } from "../../constants";
import type { User } from "../../types";
const prisma = new PrismaClient();

type GraphQLInput<T> = { input: T };

export const createUser = async (
  _: any,
  {
    input: { names, firstLastName, secondLastName, username, password, type },
  }: GraphQLInput<User>,
) => {
  try {
    const user = await prisma.user.create({
      data: {
        names,
        firstLastName,
        secondLastName,
        username,
        password: bcrypt.hashSync(password, 10),
        type: {
          connect: {
            name: type.name,
          },
        },
      },
    });

    return { created: Boolean(user), user };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new GraphQLError(
        e.code === "P2002" ? "Este usuario ya existe" : e.message,
        {
          extensions: {
            code: Code.INTERNAL_SERVER_ERROR,
            http: { status: Status.INTERNAL_SERVER_ERROR },
          },
        },
      );
    }
  }
};
export const updateUserById = async (
  _parent: any,
  {
    data: { id, data },
  }: { data: { id: string; data: Prisma.UserUpdateInput } },
) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return {
    updated: Boolean(user),
    user,
  };
};

export const updateUserByUsername = async (
  _parent: any,
  {
    input: {
      username,
      data: { names, firstLastName, secondLastName, password, type, status },
    },
  }: GraphQLInput<{ username: string; data: User }>,
) => {
  console.log(status);
  const user = await prisma.user.update({
    where: {
      username,
    },
    data: {
      names,
      firstLastName,
      secondLastName,
      username, // TODO construir el username
      password: bcrypt.hashSync(password, 10),
      type: {
        connect: {
          name: type.name,
        },
      },
    },
  });

  return {
    updated: Boolean(user),
    user,
  };
};

export const deleteUserById = async (_: any, { id }: { id: string }) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return { deleted: Boolean(user), user };
};

export const deleteUserByUsername = async (
  _: any,
  { username }: { username: string },
) => {
  try {
    const user = await prisma.user.delete({
      where: {
        username,
      },
    });
    return { deleted: Boolean(user), user };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
      throw new GraphQLError(
        e.code === "P2025" ? "Usuario no encontrado" : e.message,
        {
          extensions: {
            code: Code.BAD_REQUEST,
            http: { status: Status.BAD_REQUEST },
          },
        },
      );
    }

    throw new GraphQLError("Error del servidor", {
      extensions: {
        code: Code.INTERNAL_SERVER_ERROR,
        http: { status: Status.INTERNAL_SERVER_ERROR },
      },
    });
  }
};
