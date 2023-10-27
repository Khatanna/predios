import { Stage } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createStage = (_parent: any, { input }: { input: Stage }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'STAGE')
    return prisma.stage.create({
      data: input
    })
  } catch (e) {
    throw e;
  }
};

export const updateStage = (_parent: any, { name, item }: { name: string, item: Stage }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'STAGE')
    return prisma.stage.update({
      where: { name },
      data: item
    })
  } catch (e) {
    throw e;
  }
};

export const deleteStage = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'STAGE')
    return prisma.stage.delete({
      where: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};