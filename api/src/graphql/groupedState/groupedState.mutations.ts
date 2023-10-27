import { GroupedState } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createGroupedState = (_parent: any, { input }: { input: GroupedState }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'GROUPEDSTATE');
    return prisma.groupedState.create({
      data: input
    })
  } catch (e) {
    throw e;
  }
};
export const updateGroupedState = (_parent: any, { name, item }: Pick<GroupedState, 'name'> & { item: GroupedState }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'GROUPEDSTATE');
    return prisma.groupedState.update({
      where: {
        name
      },
      data: item
    })
  } catch (e) {
    throw e;
  }
};
export const deleteGroupedState = (_parent: any, { name }: Pick<GroupedState, 'name'>, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'GROUPEDSTATE');
    return prisma.groupedState.delete({
      where: {
        name
      },
    })
  } catch (e) {
    throw e;
  }
};