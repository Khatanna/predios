import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { PrismaClient, User, LevelPermission, Resource, Prisma } from "@prisma/client";
import { AuthResponses } from "../constants";
import { getUserWithAccessToken } from "./getUserWithAcessToken";
import { isOperationAuthLess } from "./isOperationAuthLess";
import { throwUnAuthenticateError } from "./throwUnAuthenticateError";
import { PubSub } from 'graphql-subscriptions';
import dns from 'dns';
export const prisma = new PrismaClient();
export const pubSub = new PubSub();
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

const createRecord = async ({ model, args, operation, query }: any, username: string, ip?: string) => {
  const result = await query(args);
  if (model !== 'Record') {
    await prisma.record.create({
      data: {
        description: "Consulta simple",
        ip: ip?.split(":").at(-1) ?? 'Sin definir',
        action: actions[operation],
        operation,
        resource: model.toLocaleUpperCase() as Resource,
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
    return { prisma, pubSub };
  }
  if (token) {
    const user = getUserWithAccessToken(token) as Pick<User, 'username' | 'status'>;
    if (!user) {
      throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);
    }
    // Como ya inicio sesíon prisma esta atento a su historial
    return {
      prisma: prisma.$extends({
        query: {
          $allModels: {
            create: (options) => createRecord(options, user.username, req.socket.remoteAddress),
            createMany: (options) => createRecord(options, user.username, req.socket.remoteAddress),
            update: (options) => createRecord(options, user.username, req.socket.remoteAddress),
            updateMany: (options) => createRecord(options, user.username, req.socket.remoteAddress),
            delete: (options) => createRecord(options, user.username, req.socket.remoteAddress),
            deleteMany: (options) => createRecord(options, user.username, req.socket.remoteAddress),
          },
        }
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
      pubSub
    };
  }

  throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED);
};
