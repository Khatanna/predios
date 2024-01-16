import { LevelPermission, Resource } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllUsersPaginateWithCursor = async (
  _parent: any,
  {
    nextCursor,
    prevCursor,
    numberOfResults,
    filterText,
  }: {
    nextCursor: string;
    prevCursor: string;
    numberOfResults: number;
    filterText: string;
  },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");
    const filterTextParts =
      filterText && filterText.includes(" ")
        ? filterText.trim().split(" ")
        : [];
    const skip = nextCursor ? 1 : prevCursor ? 0 : 0;
    const users = await prisma.user.findMany({
      where: {
        OR: filterText
          ? [
            {
              names: {
                contains: filterText.trim(),
              },
            },
            {
              firstLastName: {
                contains: filterText.trim(),
              },
            },
            {
              secondLastName: {
                contains: filterText.trim(),
              },
            },
            {
              username: {
                contains: filterText.trim(),
              },
            },
            {
              OR:
                filterTextParts.length === 2
                  ? [
                    {
                      names: {
                        contains: filterTextParts[0],
                      },
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                    },
                  ]
                  : [],
            },
            {
              OR:
                filterTextParts.length === 3
                  ? [
                    {
                      names: {
                        contains: filterTextParts[0],
                      },
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                      secondLastName: {
                        contains: filterTextParts[2],
                      },
                    },
                  ]
                  : [],
            },
          ]
          : undefined,
      },
      include: {
        type: true,
        role: true,
      },
      skip,
      cursor: nextCursor
        ? { id: nextCursor }
        : prevCursor
          ? { id: prevCursor }
          : undefined,
      orderBy: {
        id: "asc",
      },
      take: nextCursor
        ? numberOfResults
        : prevCursor
          ? numberOfResults * -1
          : numberOfResults,
    });
    const prevUserCursor = await prisma.user.findFirst({
      where: {
        NOT: {
          username: userContext!.username,
        },
        id: { lt: users[0]?.id },
      },
      include: {
        type: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    return {
      nextCursor: users.length > 0 ? users[users.length - 1].id : null,
      prevCursor: prevUserCursor ? prevUserCursor.id : null,
      total: filterText
        ? users.length
        : await prisma.user.count({
          where: { NOT: { username: userContext?.username } },
        }),
      users,
    };
  } catch (e) {
    throw e;
  }
};
export const getAllUsers = async (
  _parent: any,
  { filterText }: { filterText: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");

    const filterTextParts =
      filterText && filterText.includes(" ")
        ? filterText.trim().split(" ")
        : [];
    return prisma.user.findMany({
      where: {
        OR: filterText
          ? [
            {
              names: {
                contains: filterText.trim(),
              },
            },
            {
              firstLastName: {
                contains: filterText.trim(),
              },
            },
            {
              secondLastName: {
                contains: filterText.trim(),
              },
            },
            {
              username: {
                contains: filterText.trim(),
              },
            },
            {
              OR:
                filterTextParts.length === 2
                  ? [
                    {
                      names: {
                        contains: filterTextParts[0],
                      },
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                    },
                  ]
                  : [],
            },
            {
              OR:
                filterTextParts.length === 3
                  ? [
                    {
                      names: {
                        contains: filterTextParts[0],
                      },
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                      secondLastName: {
                        contains: filterTextParts[2],
                      },
                    },
                  ]
                  : [],
            },
          ]
          : undefined,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
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
      include: { role: true },
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
    hasPermission(userContext, "READ", "USER");

    const result = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        role: {
          include: {
            permissions: {
              where: {
                NOT: {
                  permission: {
                    resource: "RECORD",
                  },
                },
              },
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
};

export const getUser = async (
  _parent: any,
  { nextCursor, prevCursor }: { nextCursor?: string; prevCursor?: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");

    const user = await prisma.user.findFirstOrThrow({
      where: {
        NOT: {
          username: userContext?.username,
        },
      },
      skip: nextCursor ? 1 : prevCursor ? 0 : 0,
      cursor: nextCursor
        ? { id: nextCursor }
        : prevCursor
          ? { id: prevCursor }
          : undefined,
      orderBy: {
        id: nextCursor ? "asc" : prevCursor ? "desc" : "asc",
      },
      take: nextCursor ? 1 : prevCursor ? -1 : 1,
    });

    const prevUserCursor = await prisma.user.findFirst({
      where: {
        NOT: {
          username: userContext?.username,
        },
        id: { lt: user.id },
      },
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    return {
      nextCursor: user.id,
      prevCursor: prevUserCursor ? prevUserCursor.id : null,
      user,
    };
  } catch (e) {
    throw e;
  }
};

export const getUsers = async (
  _parent: any,
  { type, filterText }: { type?: string; filterText: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");
    const filterTextParts =
      filterText && filterText.includes(" ")
        ? filterText.trim().split(" ")
        : [];
    const result = await prisma.user.findMany({
      take: 10,
      where: {
        type: type
          ? {
            name: type,
          }
          : undefined,
        OR: filterText
          ? [
            {
              names: {
                contains: filterText.trim(),
              },
            },
            {
              firstLastName: {
                contains: filterText.trim(),
              },
            },
            {
              secondLastName: {
                contains: filterText.trim(),
              },
            },
            {
              username: {
                contains: filterText.trim(),
              },
            },
            {
              OR:
                filterTextParts.length === 2
                  ? [
                    {
                      names: {
                        contains: filterTextParts[0],
                      },
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                    },
                  ]
                  : [],
            },
            {
              OR:
                filterTextParts.length === 3
                  ? [
                    {
                      names: {
                        contains: filterTextParts[0],
                      },
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                      secondLastName: {
                        contains: filterTextParts[2],
                      },
                    },
                  ]
                  : [],
            },
            {
              OR:
                filterTextParts.length === 3
                  ? [
                    {
                      firstLastName: {
                        contains: filterTextParts[1],
                      },
                      secondLastName: {
                        contains: filterTextParts[2],
                      },
                    },
                  ]
                  : [],
            },
          ]
          : undefined,
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
};
export const getConnectUsers = (
  _parent: any,
  _args: Record<string, unknown>,
  { prisma, userContext }: Context,
) => {
  try {
    // hasPermission(userContext, "READ", "USER");
    return prisma.user.findMany({
      where: {
        connection: "ONLINE",
      },
    });
  } catch (e) {
    throw e;
  }
};
