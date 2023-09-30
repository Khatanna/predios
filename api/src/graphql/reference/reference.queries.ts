import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllReferences = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    // hasPermission();

    return prisma.reference.findMany({
      include: {
        properties: true,
      }
    })
  } catch (e) {
    throw e;
  }
};