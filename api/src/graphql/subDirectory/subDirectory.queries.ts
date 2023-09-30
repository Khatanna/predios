import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllSubDirectories = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    // hasPermission(userContext, 'READ', 'SUB_DIRECTORY');

    return prisma.subDirectory.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};