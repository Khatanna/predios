import { Prisma, Permission, User, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { AuthResponses, Code, PermissionErrorMessage, Status } from "../../constants";
import { BaseContext } from "@apollo/server";
import { throwUnAuthenticateError, throwUnauthorizedError } from "../../utilities";
// import type { User } from "../../types";
const prisma = new PrismaClient();

type GraphQLInput<T> = { input: T };

export const createUser = async (
  _: any,
  {
    input: { names, firstLastName, secondLastName, username, password, typeId },
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
            id: typeId!
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

    throw new GraphQLError("Error del servidor", {
      extensions: {
        code: Code.INTERNAL_SERVER_ERROR,
        http: { status: Status.INTERNAL_SERVER_ERROR },
      },
    });
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
      data: { names, firstLastName, secondLastName, password, typeId, status },
    },
  }: GraphQLInput<{ username: string; data: User }>,
  context: BaseContext & { user?: User & { permissions: Permission[] } },
) => {
  if (!context.user)
    throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);

  if (!context.user.permissions.some(p => p.level === 'UPDATE') || !context.user.permissions.some(p => p.resource === 'USER')) {
    throw throwUnauthorizedError(PermissionErrorMessage.UPDATE_USER);
  }
  console.log(context.user.permissions)

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
      status,
      type: {
        connect: {
          id: typeId!
        },
      }
    }
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
  context: BaseContext & { user?: User & { permissions: Permission[] } },
) => {
  if (!context.user)
    throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);

  if (!context.user.permissions.some(p => p.level === 'DELETE') || !context.user.permissions.some(p => p.resource === 'USER')) {
    throw throwUnauthorizedError(PermissionErrorMessage.DELETE_USER);
  }
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

export const createPermissionForUser = async (_parent: any, { input: { username, data } }: GraphQLInput<{ username: string, data: Pick<Permission, 'resource' | 'level'>[] }>) => {
  try {
    const user = await prisma.user.update({
      where: {
        username
      },
      data: {
        permissions: {
          connect: data.map(({ resource, level }) => ({
            resource_level: {
              resource, level
            }
          }))
        }
      }
    })

    return {
      updated: Boolean(user),
      user
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
      throw new GraphQLError(
        e.code === "P2025" ? "Este permiso no existe, asegurese de haberlo creado" : e.message,
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
}
