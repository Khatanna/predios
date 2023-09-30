import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllProvinces = (_parent: any, args: { city?: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'PROVINCE')

    return prisma.province.findMany({
      include: {
        city: true,
        municipalities: true
      },
      where: args.city ? {
        city: {
          name: args.city
        }
      } : undefined
    })
  } catch (e) {
    throw e;
  }
};
