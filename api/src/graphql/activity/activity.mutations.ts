import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createActivity = (_parent: any, { input: { name } }: { input: { name: string } }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'ACTIVITY');

    return prisma.activity.create({
      data: {
        name
      }
    })
  } catch (e) {
    throw e;
  }
};