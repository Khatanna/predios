import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllMunicipalities = (_parent: any, args: { province: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'MUNICIPALITY')

    return prisma.municipality.findMany({
      include: {
        province: true,
      },
      where: args.province ? {
        province: {
          name: args.province
        }
      } : undefined
    })
  } catch (e) {
    throw e;
  }
};
