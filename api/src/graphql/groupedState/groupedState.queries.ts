import { GroupedState } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllGroupedStates = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'GROUPEDSTATE');
    return prisma.groupedState.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getGroupedState = (_parent: any, { name }: Pick<GroupedState, 'name'>, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'GROUPEDSTATE');
    return prisma.groupedState.findUniqueOrThrow({
      where: {
        name
      },
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};