import { ResponsibleUnit } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createResponsibleUnit = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'RESPONSIBLEUNIT');
    return prisma.responsibleUnit.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateResponsibleUnit = (_parent: any, { name, item }: { name: string, item: ResponsibleUnit }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'RESPONSIBLEUNIT');
    return prisma.responsibleUnit.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};

export const deleteResponsibleUnit = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'RESPONSIBLEUNIT');
    return prisma.responsibleUnit.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};