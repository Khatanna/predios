import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllResponsibleUnits = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    // hasPermission(userContext, 'READ', 'RESPONSIBLEUNIT')
    return prisma.responsibleUnit.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};