import { Reference } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createReference = (_parent: any, { input }: { input: Reference }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'REFERENCE');

    return prisma.reference.create({
      data: input
    })
  } catch (e) {
    throw e;
  }
};

export const updateReference = (_parent: any, { name, item }: Pick<Reference, 'name'> & { item: Reference }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'REFERENCE');

    return prisma.reference.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};

export const deleteReference = (_parent: any, { name }: Pick<Reference, 'name'>, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'REFERENCE');

    return prisma.reference.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

