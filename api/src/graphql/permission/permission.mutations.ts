import { GraphQLError } from "graphql";
// import { Permission } from "../../types";
import { Prisma, Permission, PrismaClient } from "@prisma/client";
import { Code, Status } from "../../constants";
import { throwPrismaError } from "../../utilities/throwPrismaError";


const prisma = new PrismaClient();
type Args = { input: Permission }

export const createPermission = async (_parent: any, { input: { name, description, resource, level } }: Args) => {
  try {
    console.log({ name, description, resource, level })
    const permission = await prisma.permission.create({
      data: {
        name,
        description,
        resource,
        level
      }
    })

    return {
      created: Boolean(permission),
      permission
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw throwPrismaError(e);
    }
    console.log(e)
    throw new GraphQLError("Error del servidor", {
      extensions: {
        code: Code.INTERNAL_SERVER_ERROR,
        http: { status: Status.INTERNAL_SERVER_ERROR },
      },
    });
  }
};

export const updatePermission = async (_parent: any, { input: { name, description, resource, level } }: Args) => {
  try {
    const permission = await prisma.permission.update({
      where: {
        resource_level: {
          resource,
          level
        }
      },
      data: {
        name, description
      }
    })

    return {
      updated: Boolean(permission),
      permission
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw throwPrismaError(e);
    }
    console.log(e)
    throw new GraphQLError("Error del servidor", {
      extensions: {
        code: Code.INTERNAL_SERVER_ERROR,
        http: { status: Status.INTERNAL_SERVER_ERROR },
      },
    });
  }
}