import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllMunicipalities = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'MUNICIPALITY')

    return prisma.municipality.findMany({
      include: {
        province: true,
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getMunicipalities = (_parent: any, { province }: { province?: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'MUNICIPALITY')

    if (province) {
      return prisma.municipality.findMany({
        where: {
          province: {
            name: province
          }
        }
      })
    }
    return []
  } catch (e) {
    throw e;
  }
};

export const getMunicipality = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'MUNICIPALITY')

    return prisma.municipality.findUniqueOrThrow({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};
