import { Role, Status, Type, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

type GraphQLInput<T> = { input: T };

export const createUser = async (
  _: any,
  {
    input: {
      names,
      firstLastName,
      secondLastName,
      username,
      password,
      type,
      role,
    },
  }: { input: User & { type: Pick<Type, "name">; role: Role } },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "USER");
    return prisma.user.create({
      data: {
        names,
        firstLastName,
        secondLastName,
        username,
        password: bcrypt.hashSync(password, 10),
        type: {
          connect: type,
        },
        role: {
          connect: role,
        },
      },
    });
  } catch (e) {
    throw e;
  }
};

export const updateUserByUsername = async (
  _parent: any,
  {
    username,
    input: {
      names,
      firstLastName,
      secondLastName,
      password,
      status,
      type,
      role,
    },
  }: {
    username: string;
    input: User & { type: Pick<Type, "name">; role: Role };
  },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "USER");
    // const permissions = await prisma.permission.findMany({
    //   where: {
    //     roles: {
    //       some: role,
    //     },
    //   },
    // });

    const user = await prisma.user.update({
      where: {
        username,
      },
      data: {
        names,
        firstLastName,
        secondLastName,
        username,
        password: bcrypt.hashSync(password, 10),
        status,
        type: {
          connect: type,
        },
        role: {
          connect: role,
        },
      },
    });

    return user;
  } catch (e) {
    throw e;
  }
};

export const updateStateUserByUsername = (
  _parent: any,
  {
    username,
    input: { status },
  }: { username: string; input: Pick<User, "status"> },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "USER");
    return prisma.user.update({
      where: {
        username,
      },
      data: {
        status,
      },
      include: {
        type: true,
        role: true,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const deleteUserByUsername = (
  _: any,
  { username }: { username: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "USER");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
        // prisma.user.delete({
        //   where: {
        //     username,
        //   },
        // });
      }, 4000);
    });
  } catch (e) {
    throw e;
  }
};

export const updateStateUsersByUsername = async (
  _parent: any,
  {
    input: { usernames, status },
  }: { input: { usernames: string[]; status: Status } },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "USER");
    const users = await prisma.$transaction(
      usernames.map((username) => {
        return prisma.user.update({
          where: {
            username,
          },
          data: {
            status,
          },
        });
      }),
    );

    return {
      users: users,
      count: users.length,
    };
  } catch (e) {
    throw e;
  }
};
