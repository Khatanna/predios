import { Municipality } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createMunicipality = (_parent: any, { name, provinceName }: { name: string, provinceName: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'MUNICIPALITY');

    return prisma.municipality.create({
      data: {
        name,
        province: {
          connect: {
            name: provinceName
          }
        }
      }
    });
  } catch (e) {
    throw e;
  }
}
export const updateMunicipality = (_parent: any, { name, item }: { name: string, item: Municipality }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'MUNICIPALITY');

    return prisma.municipality.update({
      where: {
        name
      },
      data: item
    });
  } catch (e) {
    throw e;
  }
}
export const deleteMunicipality = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'MUNICIPALITY');

    return prisma.municipality.delete({
      where: {
        name
      }
    });
  } catch (e) {
    throw e;
  }
}