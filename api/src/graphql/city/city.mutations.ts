import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createCity = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'CITY')

    return prisma.city.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};
export const updateCity = (_parent: any, { name, newName }: { name: string, newName: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'CITY')

    return prisma.city.update({
      where: {
        name
      },
      data: {
        name: newName
      }
    })
  } catch (e) {
    throw e;
  }
};
export const deleteCity = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'CITY')

    return prisma.city.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};
