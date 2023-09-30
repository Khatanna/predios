import { Context } from "../../types";

export const getAllClasifications = (_parent: any, args: any, { prisma, userContext }: Context) => {
  try {
    return prisma.clasification.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};