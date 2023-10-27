import { Unit } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createUnit = (_parent: any, { input }: { input: Unit }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'UNIT');
    return prisma.unit.create({
      data: input
    })
  } catch (e) {
    throw e;
  }
};

export const updateUnit = (_parent: any, { name, item }: { name: string, item: Unit }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'UNIT');
    return prisma.unit.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};

export const deleteUnit = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'UNIT');
    return prisma.unit.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};