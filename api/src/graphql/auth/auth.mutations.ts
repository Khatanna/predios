import { verify } from "jsonwebtoken";
import { AuthErrorMessage, LifeTimeToken } from "../../constants";
import { Context } from "../../types";
import {
  handleJWTError,
  mapUserForToken,
  updateRefreshToken,
  verifyPassword,
  verifyUsername,
} from "../../utilities";
import { generateToken } from "../../utilities/generateToken";
import { throwLoginError } from "../../utilities/throwLoginError";

export const login = async (
  _parent: any,
  input: { username: string; password: string },
  { prisma }: Context,
) => {
  const { username, password } = input;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        password: true,
        status: true,
      },
    });

    if (user) {
      if (user.status === "DISABLE") {
        throw throwLoginError(AuthErrorMessage.USER_DISABLE);
      }

      if (!verifyUsername(username, user.username)) {
        throw throwLoginError(AuthErrorMessage.UNREGISTERED_USER);
      }

      if (!verifyPassword(password, user.password)) {
        throw throwLoginError(AuthErrorMessage.INVALID_PASSWORD);
      }

      const accessToken = generateToken(
        mapUserForToken(user, ["password"]),
        process.env.ACCESS_TOKEN_SECRET!,
        LifeTimeToken.day,
      );
      const refreshToken = generateToken(
        mapUserForToken(user, ["password"]),
        process.env.REFRESH_TOKEN_SECRET!,
        LifeTimeToken.week,
      );

      await updateRefreshToken(username, refreshToken, prisma);
      return { accessToken, refreshToken };
    }

    throw throwLoginError(AuthErrorMessage.UNREGISTERED_USER);
  } catch (e) {
    throw e;
  }
};

export const getNewAccessToken = async (
  _parent: any,
  { refreshToken }: { refreshToken: string },
  { prisma }: Context,
) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        token: refreshToken,
      },
      select: {
        username: true,
      },
    });

    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    const accessToken = generateToken(
      user!,
      process.env.ACCESS_TOKEN_SECRET!,
      LifeTimeToken.day,
    );
    return accessToken;
  } catch (e) {
    throw e
  }
};
