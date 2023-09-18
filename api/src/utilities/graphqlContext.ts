import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { PrismaClient, User, LevelPermission, Resource, Prisma } from "@prisma/client";
import { AuthResponses } from "../constants";
import { getUserWithAccessToken } from "./getUserWithAcessToken";
import { isOperationAuthLess } from "./isOperationAuthLess";
import { throwUnAuthenticateError } from "./throwUnAuthenticateError";
import ip from "ip";

const prisma = new PrismaClient();

const actions: Record<string, LevelPermission> = {
  findMany: 'READ',
  findUnique: 'READ',
  findFirst: 'READ',
  create: 'CREATE',
  createMany: 'CREATE',
  delete: 'DELETE',
  deleteMany: 'DELETE',
  update: 'UPDATE',
  updateMany: 'UPDATE',
  upsert: 'UPDATE',
  findFirstOrThrow: 'READ',
  findUniqueOrThrow: 'READ',
}

const createRecord = async ({ model, args, operation, query }: any, username: string) => {
  const result = await query(args);
  if (model !== 'Record') {
    await prisma.record.create({
      data: {
        description: "Consulta simple",
        ip: ip.address(),
        action: actions[operation],
        operation,
        resource: model === "UserPermission" ? "USER_PERMISSION" : model.toLocaleUpperCase() as Resource,
        user: {
          connect: {
            username
          },
        },
        result: JSON.stringify(result, undefined, 0),
      },
    });
  }
  return result;
}

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
    // Como ya inicio sesíon prisma esta atento a su historial
    return {
      prisma: prisma.$extends({
        query: {
          $allModels: {
            create: (options) => createRecord(options as typeof options, user.username),
            createMany: (options) => createRecord(options, user.username),
            update: (options) => createRecord(options, user.username),
            updateMany: (options) => createRecord(options, user.username),
            delete: (options) => createRecord(options, user.username),
            deleteMany: (options) => createRecord(options, user.username),
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
