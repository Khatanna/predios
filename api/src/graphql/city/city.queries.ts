import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllCities = async (_parent: any, args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'CITY');
    return prisma.city.findMany({
      include: {
        provinces: {
          include: {
            municipalities: {
              orderBy: {
                name: 'asc'
              }
            },
          },
          orderBy: {
            name: 'asc'
          }
        },
      },
      orderBy: {
        name: 'asc'
      }
    });
  } catch (e) {
    throw e;
  }
};

export const getCity = async (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'CITY');
    console.log(name)
    return prisma.city.findUnique({
      where: { name },
      include: { provinces: { include: { municipalities: true } } },
    });
  } catch (e) {
    throw e;
  }
};
