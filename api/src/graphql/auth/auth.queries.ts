import { Prisma, PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import {
  handleJWTError,
  mapUserForToken,
  verifyPassword,
  verifyUsername,
} from "../../utilities";
import { AuthErrorMessage, LifeTimeToken } from "../../constants";
import { generateToken } from "../../utilities/generateToken";
import { BaseContext } from "@apollo/server";
import { throwLoginError } from "../../utilities/throwLoginError";
import { throwPrismaError } from "../../utilities/throwPrismaError";
import { GraphQLError } from "graphql";

const prisma = new PrismaClient();

const updateRefreshToken = (username: string, token: string) => {
  return prisma.user.update({
    where: {
      username,
    },
    data: {
      session: {
        upsert: {
          where: {
            user: {
              username,
            },
          },
          update: {
            token,
          },
          create: {
            token,
          },
        },
      },
    },
  });
};

export const login = async (
  _parent: any,
  args: Record<string, string>,
  context: BaseContext,
) => {
  const { username, password } = args;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        password: true,
        permissions: true,
        status: true,
        role: true,
      },
    });

    if (user) {
      if (verifyUsername(username, user.username)) {
        throw throwLoginError(AuthErrorMessage.UNREGISTERED_USER);
      }

      if (!verifyPassword(password, user.password)) {
        throw throwLoginError(AuthErrorMessage.INVALID_PASSWORD);
      }

      if (user.status === "DISABLE") {
        throw throwLoginError(AuthErrorMessage.USER_DISABLE);
      }

      const accessToken = generateToken(
        mapUserForToken(user, ["password"]),
        process.env.ACCESS_TOKEN_SECRET!,
        LifeTimeToken.day,
      );
      const refreshToken = generateToken(
        mapUserForToken(user, ["password", "permissions"]),
        process.env.REFRESH_TOKEN_SECRET!,
        LifeTimeToken.week,
      );

      await updateRefreshToken(username, refreshToken);
      return { accessToken, refreshToken };
    }

    throw throwLoginError(AuthErrorMessage.UNREGISTERED_USER);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw throwPrismaError(e);
    }
    console.log(e);
    if (e instanceof GraphQLError) {
      throw throwLoginError(e.message);
    }

    throw throwLoginError("Ocurrio un error en el servidor");
  }
};

export const getNewAccessToken = async (
  _parent: any,
  { refreshToken }: { refreshToken: string },
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        session: {
          token: refreshToken,
        },
      },
      select: {
        username: true,
        role: true,
        permissions: true,
      },
    });

    if (!user) {
      throw Error("No existe el token en la base de datos");
    }

    const verifyRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );
    if (typeof verifyRefreshToken !== "string") {
      const accessToken = generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET!,
        LifeTimeToken.day,
      );
      return accessToken;
    }

    return null;
  } catch (e) {
    // Manejar en el cliente por si el error es de token expirado
    throw handleJWTError(e);
  }
};
