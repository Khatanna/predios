import { Clasification } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createClasification = (_parent: any, { name }: Pick<Clasification, 'name'>, { prisma, userContext }: Context) => {

  try {
    hasPermission(userContext, 'CREATE', 'CLASIFICATION');
    return prisma.clasification.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateClasification = (_parent: any, { name, item }: Pick<Clasification, 'name'> & { item: Clasification }, { prisma, userContext }: Context) => {

  try {
    hasPermission(userContext, 'UPDATE', 'CLASIFICATION');
    return prisma.clasification.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};

export const deleteClasification = (_parent: any, { name }: Pick<Clasification, 'name'>, { prisma, userContext }: Context) => {

  try {
    hasPermission(userContext, 'DELETE', 'CLASIFICATION');
    return prisma.clasification.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};