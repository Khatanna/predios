import { isOperationAuthLess } from "./isOperationAuthLess";
import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { getUserWithAccessToken } from "./getUserWithAcessToken";
import { throwUnAuthenticateError } from "./throwUnAuthenticateError";
import { AuthResponses } from "../constants";
import { TokenExpiredError } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { Context } from "../types";

const prisma = new PrismaClient();

export const graphqlContext = async ({ req }: StandaloneServerContextFunctionArgument) => {
  const token = req.headers.authorization
  const operation = req.headers.operation!;
  if (isOperationAuthLess(operation)) {
    return { prisma };
  }

  if (token) {
    const user = getUserWithAccessToken(token) as User;
    if (!user) {
      throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED)
    }

    return {
      prisma,
      userContext: await prisma.user.findUnique({
        where: {
          username: user.username
        },
        select: {
          username: true,
          status: true,
          permissions: {
            select: {
              status: true,
              permission: {
                select: {
                  level: true, resource: true, status: true
                }
              }
            }
          }
        }
      })
    };
  }

  throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED)
}
