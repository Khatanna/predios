import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllProvinces = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'PROVINCE')

    return prisma.province.findMany({
      include: {
        city: true,
        municipalities: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  } catch (e) {
    throw e;
  }
};
export const getProvinces = (_parent: any, args: { city: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'PROVINCE')

    if (args.city) {
      return prisma.province.findMany({
        where: {
          city: {
            name: args.city
          }
        },
        orderBy: {
          name: 'asc'
        },
        include: {
          city: true,
          municipalities: true
        },
      })
    }

    return [];
  } catch (e) {
    throw e;
  }
};
export const getProvince = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'PROVINCE')

    return prisma.province.findUniqueOrThrow({
      where: {
        name
      },
      include: {
        city: true,
        municipalities: true
      },
    })

  } catch (e) {
    throw e;
  }
};
