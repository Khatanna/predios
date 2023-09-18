import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const allUsers = async (
  _parent: any,
  _args: any,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");
    return prisma.user.findMany({
      where: {
        NOT: {
          username: userContext!.username,
        },
      },
      include: {
        permissions: {
          select: {
            status: true,
            permission: true,
            user: true,
          },
        },
        type: true,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const getUserById = async (
  _: any,
  { id }: { id: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");

    const user = await prisma.user.findUnique({
      where: { id },
      include: { permissions: true },
    });

    return user;
  } catch (e) {
    throw e;
  }
};

export const getUserByUsername = async (
  _: any,
  { username }: { username: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER_PERMISSION");

    return prisma.user.findUnique({
      where: { username },
      include: {
        permissions: {
          include: {
            permission: true,
            user: true,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
