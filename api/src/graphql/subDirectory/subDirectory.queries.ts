import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllSubDirectories = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'SUBDIRECTORY');

    return prisma.subDirectory.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getSubdirectory = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'SUBDIRECTORY');

    return prisma.subDirectory.findUniqueOrThrow({
      where: {
        name
      },
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};