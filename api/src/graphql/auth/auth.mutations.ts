import { verify } from "jsonwebtoken";
import { AuthErrorMessage, LifeTimeToken } from "../../constants";
import { PrismaContext, PubSubContext } from "../../types";
import {
  selectKeys,
  deleteKeys,
  verifyPassword,
  verifyUsername,
} from "../../utilities";
import { generateToken } from "../../utilities/generateToken";
import { User } from "@prisma/client";

// const userMapped = (user: User, fields: (keyof User)[]) => {
//   return fields.reduce((acc, item) => {
//     if (!user[item]) return acc;

//     if (user[item] instanceof Date) {
//       acc[item] = (user[item] as Date).toISOString();
//       // return acc;
//     }
//     // if (user[item] instanceof Object) {
//     //   acc[item] = user[item];
//     //   return acc;
//     // }

//     acc[item] = user[item] as string;
//     return acc;
//   }, {} as { [index in keyof User]: string | null });
// };

export const login = async (
  _parent: any,
  input: { username: string; password: string },
  { prisma }: PrismaContext & PubSubContext,
) => {
  try {
    const { username, password } = input;
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username,
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
      },
    });
    if (user.status === "DISABLE") {
      throw new Error(AuthErrorMessage.USER_DISABLE);
    }

    if (!verifyUsername(username, user.username)) {
      throw new Error(AuthErrorMessage.UNREGISTERED_USER);
    }

    if (!verifyPassword(password, user.password)) {
      throw new Error(AuthErrorMessage.INVALID_PASSWORD);
    }

    const accessToken = generateToken(
      selectKeys<typeof user>(user, ["username"]),
      process.env.ACCESS_TOKEN_SECRET!,
      LifeTimeToken.day,
    );
    const refreshToken = generateToken(
      selectKeys<typeof user>(user, ["id"]),
      process.env.REFRESH_TOKEN_SECRET!,
      LifeTimeToken.week,
    );

    await prisma.user.update({
      where: { username },
      data: {
        token: refreshToken,
      },
    });
    return { accessToken, refreshToken, user };
  } catch (e) {
    throw e;
  }
};

export const logout = async (
  _parent: any,
  { username, token }: { username: string; token: string },
  { prisma }: PrismaContext & PubSubContext,
) => {
  try {
    const user = await prisma.user.update({
      where: {
        username,
        token,
      },
      data: {
        connection: "OFFLINE",
        token: undefined,
      },
    });

    return Boolean(user);
  } catch (e) {
    throw e;
  }
};
