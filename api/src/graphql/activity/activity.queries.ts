import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllActivities = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'ACTIVITY')

    return prisma.activity.findMany({
      include: {
        properties: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  } catch (e) {
    throw e
  }
}

export const getActivity = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'ACTIVITY')

    return prisma.activity.findUniqueOrThrow({
      where: {
        name
      },
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e
  }
}