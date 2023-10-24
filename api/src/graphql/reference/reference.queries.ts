import { Reference } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllReferences = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'REFERENCE');

    return prisma.reference.findMany({
      include: {
        properties: true,
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getReference = (_parent: any, { name }: Pick<Reference, 'name'>, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'REFERENCE');

    return prisma.reference.findUniqueOrThrow({
      where: {
        name
      },
      include: {
        properties: true,
      }
    })
  } catch (e) {
    throw e;
  }
};