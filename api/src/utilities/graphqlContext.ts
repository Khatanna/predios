import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { PrismaClient, User, Prisma } from "@prisma/client";
import { AuthResponses } from "../constants";
import { getUserWithAccessToken } from "./getUserWithAcessToken";
import { isOperationAuthLess } from "./isOperationAuthLess";
import { throwUnAuthenticateError } from "./throwUnAuthenticateError";
import ip from "ip";
const prisma = new PrismaClient();

export const graphqlContext = async ({
  req,
}: StandaloneServerContextFunctionArgument) => {
  const token = req.headers.authorization;
  const operation = req.headers.operation!;
  if (isOperationAuthLess(operation)) {
    return { prisma };
  }

  if (token) {
    const user = getUserWithAccessToken(token) as User;
    if (!user) {
      throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);
    }
    // Com ya inicio sesíon prisma esta atento a su historial
    return {
      prisma: prisma.$extends({
        query: {
          $allModels: {
            async $allOperations({ model, args, operation, query }) {
              const result = await query(args);
              console.log(ip.address());
              // console.log({ model, args, operation, query, result });
              // console.log("usuario: ", user.username);
              await prisma.record.create({
                data: {
                  operation,
                  resource: model,
                  user: {
                    connect: {
                      username: user.username,
                    },
                  },
                  result: JSON.stringify(result, undefined, 0),
                },
              });
              return result;
            },
          },
        },
      }),
      userContext: await prisma.user.findUnique({
        where: {
          username: user.username,
        },
        select: {
          username: true,
          status: true,
          permissions: {
            select: {
              status: true,
              permission: {
                select: {
                  level: true,
                  resource: true,
                  status: true,
                },
              },
            },
          },
        },
      }),
    };
  }

  throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);
};
