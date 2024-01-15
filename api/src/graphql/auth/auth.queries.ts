import { verify } from "jsonwebtoken";
import { PrismaContext } from "../../types";
import { generateToken, selectKeys } from "../../utilities";
import { LifeTimeToken } from "../../constants";
import { User } from "@prisma/client";

export const getNewAccessToken = async (
  _parent: any,
  { refreshToken }: { refreshToken: string },
  { prisma }: PrismaContext,
) => {
  try {
    const { id } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as Pick<User, "id">;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        token: refreshToken,
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

    return {
      accessToken: generateToken(
        selectKeys(user, ["username"]),
        process.env.ACCESS_TOKEN_SECRET!,
        LifeTimeToken.day,
      ),
      user,
    };
  } catch (e) {
    throw e;
  }
};
