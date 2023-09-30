import { Context } from "../../types";
import { hasPermission, prisma } from "../../utilities";

export const getAllGroupedStates = (_parent: any, _args: any, context: Context) => {
  try {
    // hasPermission();
    return prisma.groupedState.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};