import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllUsers = async (
  _parent: any,
  { nextCursor, prevCursor, numberOfResults, filterText }: { nextCursor: string, prevCursor: string, numberOfResults: number; filterText: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "USER");
    // console.log({ nextCursor, prevCursor, numberOfResults, filterText })
    const filterTextParts = filterText && filterText.includes(" ") ? filterText.trim().split(" ") : []
    const skip = nextCursor ? 1 : prevCursor ? 0 : 0;
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          username: userContext!.username,
        },
        OR: filterText ? [
          {
            names: {
              contains: filterText.trim(),
            },
          },
          {
            firstLastName: {
              contains: filterText.trim()
            }
          },
          {
            secondLastName: {
              contains: filterText.trim()
            }
          },
          {
            username: {
              contains: filterText.trim()
            }
          },
          {
            OR: filterTextParts.length === 2 ? [
              {
                names: {
                  contains: filterTextParts[0]
                },
                firstLastName: {
                  contains: filterTextParts[1]
                }
              }
            ] : []
          },
          {
            OR: filterTextParts.length === 3 ? [
              {
                names: {
                  contains: filterTextParts[0]
                },
                firstLastName: {
                  contains: filterTextParts[1]
                },
                secondLastName: {
                  contains: filterTextParts[2]
                }
              }
            ] : []
          }
        ] : undefined
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
      skip,
      cursor: nextCursor ? { id: nextCursor } : prevCursor ? { id: prevCursor } : undefined,
      orderBy: {
        id: 'asc'
      },
      take: nextCursor ? numberOfResults : prevCursor ? numberOfResults * -1 : numberOfResults,
    });
    console.log(users.map(u => u.username))
    const prevUserCursor = await prisma.user.findFirst({
      where: {
        NOT: {
          username: userContext!.username,
        },
        id: { lt: users[0]?.id }
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
      orderBy: {
        id: 'desc'
      },
      take: 1
    })
    return {
      nextCursor: users.length > 0 ? users[users.length - 1].id : null,
      prevCursor: prevUserCursor ? prevUserCursor.id : null,
      total: filterText ? users.length : await prisma.user.count({ where: { NOT: { username: userContext?.username } } }),
      users,
    }
  } catch (e) {
    throw e;
  }
};
// export const allUsers = async (
//   _parent: any,
//   _args: any,
//   { prisma, userContext }: Context,
// ) => {
//   try {
//     hasPermission(userContext, "READ", "USER");
//     return prisma.user.findMany({
//       where: {
//         NOT: {
//           username: userContext!.username,
//         },
//       },
//       include: {
//         permissions: {
//           select: {
//             status: true,
//             permission: true,
//             user: true,
//           },
//         },
//         type: true,
//       },
//     });
//   } catch (e) {
//     throw e;
//   }
// };

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

export const getUser = async (_parent: any, { nextCursor, prevCursor }: { nextCursor?: string, prevCursor?: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'USER')

    const user = await prisma.user.findFirstOrThrow({
      where: {
        NOT: {
          username: userContext?.username
        }
      },
      skip: nextCursor ? 1 : prevCursor ? 0 : 0,
      cursor: nextCursor
        ? { id: nextCursor }
        : prevCursor
          ? { id: prevCursor }
          : undefined,
      orderBy: {
        id: nextCursor ? 'asc' : prevCursor ? 'desc' : 'asc'
      },
      take: nextCursor ? 1 : prevCursor ? -1 : 1,
    });

    const prevUserCursor = await prisma.user.findFirst({
      where: {
        NOT: {
          username: userContext?.username
        },
        id: { lt: user.id }
      },
      orderBy: {
        id: 'desc'
      },
      take: 1
    })
    return {
      nextCursor: user.id,
      prevCursor: prevUserCursor ? prevUserCursor.id : null,
      user
    }
  } catch (e) {
    throw e;
  }
}
