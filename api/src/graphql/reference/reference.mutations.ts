import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createReference = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'REFERENCE');

    return prisma.reference.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateReference = (_parent: any, { name, currentName }: { currentName: string, name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'REFERENCE');

    return prisma.reference.update({
      where: {
        name: currentName
      },
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

export const deleteReference = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
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

