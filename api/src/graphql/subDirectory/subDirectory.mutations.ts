import { SubDirectory } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createSubdirectory = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'SUBDIRECTORY')

    return prisma.subDirectory.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateSubdirectory = (_parent: any, { name, item }: { name: string, item: SubDirectory }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'SUBDIRECTORY')

    return prisma.subDirectory.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};
export const deleteSubdirectory = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'SUBDIRECTORY')

    return prisma.subDirectory.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};