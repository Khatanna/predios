import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllFolderLocations = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'FOLDERLOCATION');

    return prisma.folderLocation.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getFolderLocation = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'FOLDERLOCATION');

    return prisma.folderLocation.findUniqueOrThrow({
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