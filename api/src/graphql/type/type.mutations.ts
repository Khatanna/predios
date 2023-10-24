import { Type } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createType = (_parent: any, { name }: Pick<Type, 'name'>, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'TYPE');

    return prisma.type.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateType = (_parent: any, { name, item }: { name: string, item: Type }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'TYPE');

    return prisma.type.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};
export const deleteType = (_parent: any, { name }: Pick<Type, 'name'>, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'TYPE');

    return prisma.type.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};