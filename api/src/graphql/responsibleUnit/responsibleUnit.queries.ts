import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllResponsibleUnits = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'RESPONSIBLEUNIT')
    return prisma.responsibleUnit.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getResponsibleUnit = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'RESPONSIBLEUNIT')
    console.log({ name })
    return prisma.responsibleUnit.findUniqueOrThrow({
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