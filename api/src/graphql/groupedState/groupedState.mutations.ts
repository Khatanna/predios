import { GroupedState } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createGroupedState = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'GROUPEDSTATE');
    return prisma.groupedState.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};
export const updateGroupedState = (_parent: any, { currentName, name }: { currentName: string, name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'GROUPEDSTATE');
    return prisma.groupedState.update({
      where: {
        name: currentName
      },
      data: {
        name
      }
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