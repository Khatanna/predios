import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllStates = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'STATE')
    return prisma.state.findMany({
      include: {
        stage: true,
        properties: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getState = (_parent: any, { name }: { name?: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'STATE')
    return prisma.state.findUniqueOrThrow({
      include: {
        stage: true,
        properties: true,
      },
      where: {
        name
      }
    })

  } catch (e) {
    throw e;
  }
};