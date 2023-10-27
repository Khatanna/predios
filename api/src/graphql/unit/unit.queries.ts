import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllUnits = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'UNIT')
    return prisma.unit.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getUnit = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'UNIT')
    return prisma.unit.findUniqueOrThrow({
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