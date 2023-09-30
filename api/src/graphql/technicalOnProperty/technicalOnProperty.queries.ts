import { Context } from "../../types";

export const getAllTecnicians = (_parent: any, args: any, { prisma, userContext }: Context) => {
  try {
    return prisma.technicalOnProperty.findMany({
      include: {
        user: true,
      }
    });
  } catch (e) {
    throw e;
  }
};