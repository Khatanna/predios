import {
  LevelPermission,
  Resource,
  Status as StatusDB,
  User,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

type GraphQLInput<T> = { input: T };

export const createUser = async (
  _: any,
  {
    input: { names, firstLastName, secondLastName, username, password, typeId },
  }: GraphQLInput<User>,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "USER");
    const user = await prisma.user.create({
      data: {
        names,
        firstLastName,
        secondLastName,
        username,
        password: bcrypt.hashSync(password, 10),
        type: {
          connect: {
            id: typeId!,
          },
        },
      },
    });

    return { created: Boolean(user), user };
  } catch (e) {
    throw e;
  }
};

export const updateUserByUsername = async (
  _parent: any,
  {
    input: {
      username,
      data: { names, firstLastName, secondLastName, password, typeId, status },
    },
  }: GraphQLInput<{ username: string; data: User }>,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "USER");
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
            id: typeId!,
          },
        },
      },
    });

    return {
      updated: Boolean(user),
      user,
    };
  } catch (e) {
    throw e;
  }
};

export const updateStateUserByUsername = async (
  _parent: any,
  {
    input: { username, data },
  }: GraphQLInput<{ username: string; data: Pick<User, "status"> }>,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "USER");
    const user = await prisma.user.update({
      where: {
        username,
      },
      data,
    });

    return {
      updated: Boolean(user),
      user,
    };
  } catch (e) {
    throw e;
  }
};

export const deleteUserByUsername = async (
  _: any,
  { username }: { username: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "USER");
    const user = await prisma.user.delete({
      where: {
        username,
      },
    });
    return { deleted: Boolean(user), user };
  } catch (e) {
    throw e;
  }
};

export const createPermissionForUser = async (
  _parent: any,
  {
    input: { username, data },
  }: GraphQLInput<{
    username: string;
    data: { resource: string; levels: string[] }[];
  }>,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "USER_PERMISSION");
    const elements = data.flatMap(({ resource, levels }) =>
      levels.map((level) =>
        prisma.userPermission.create({
          data: {
            user: {
              connect: {
                username,
              },
            },
            permission: {
              connect: {
                resource_level: {
                  resource: resource as Resource,
                  level: level as LevelPermission,
                },
              },
            },
          },
          select: {
            permission: true,
          },
        }),
      ),
    );
    const permissions = await prisma.$transaction(elements);

    return {
      created: true,
      permissions,
    };
  } catch (e) {
    throw e;
  }
};

export const updateStateOfPermissionUserByUsername = async (
  _parent: any,
  {
    input: {
      username,
      data: { resource, level, status },
    },
  }: GraphQLInput<{
    username: string;
    data: { resource: Resource; level: LevelPermission; status: StatusDB };
  }>,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "USER_PERMISSION");
    const userPermission = await prisma.userPermission.findFirst({
      where: {
        user: {
          username,
        },
        permission: {
          level,
          resource,
        },
      },
    });
    const updated = await prisma.userPermission.update({
      where: {
        id: userPermission?.id,
      },
      data: {
        status,
      },
    });
    return {
      updated: Boolean(updated),
      permission: updated,
    };
  } catch (e) {
    throw e;
  }
};

export const deletePermissionOfUserByUsername = async (
  _parent: any,
  {
    input: {
      username,
      data: { resource, level, status },
    },
  }: GraphQLInput<{
    username: string;
    data: { resource: Resource; level: LevelPermission; status: StatusDB };
  }>,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "USER_PERMISSION");
    const userPermission = await prisma.userPermission.findFirst({
      where: {
        user: {
          username,
        },
        permission: {
          level,
          resource,
        },
      },
    });

    const permission = await prisma.userPermission.delete({
      where: {
        id: userPermission!.id,
      },
    });

    return {
      deleted: Boolean(permission),
      permission,
    };
  } catch (e) {
    throw e;
  }
};
