import { verify } from "jsonwebtoken";
import { AuthErrorMessage, LifeTimeToken } from "../../constants";
import { PrismaContext, PubSubContext } from "../../types";
import {
  mapUserForToken,
  verifyPassword,
  verifyUsername,
} from "../../utilities";
import { generateToken } from "../../utilities/generateToken";
import { throwLoginError } from "../../utilities/throwLoginError";

export const login = async (
  _parent: any,
  input: { username: string; password: string },
  { prisma, pubSub }: PrismaContext & PubSubContext,
) => {
  try {
    const { username, password } = input;
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        username: true,
        password: true,
        status: true,
        role: {
          select: {
            name: true,
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
      user,
      process.env.ACCESS_TOKEN_SECRET!,
      LifeTimeToken.day,
    );
    const refreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET!,
      LifeTimeToken.week,
    );

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        token: refreshToken,
      },
    });

    return { accessToken, refreshToken };
    // throw throwLoginError(AuthErrorMessage.UNREGISTERED_USER);
  } catch (e) {
    throw e;
  }
};

export const logout = async (
  _parent: any,
  { username, token }: { username: string; token: string },
  { prisma, pubSub }: PrismaContext & PubSubContext,
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
export const getNewAccessToken = async (
  _parent: any,
  { refreshToken }: { refreshToken: string },
  { prisma }: PrismaContext,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        token: refreshToken,
      },
      select: {
        username: true,
        connection: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(
        "El Token de sesión no ha sido encontrado vuelva a iniciar sesión",
      );
    }
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const accessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET!,
      LifeTimeToken.day,
    );
    return accessToken;
  } catch (e) {
    throw e;
  }
};
