import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllStates = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'STATE')
    return prisma.state.findMany({
      include: {
        stage: true,
        properties: true,
      }
    })
  } catch (e) {
    throw e;
  }
};