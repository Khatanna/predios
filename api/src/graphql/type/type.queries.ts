import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllTypes = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    // hasPermission(userContext, 'READ', 'TYPE')

    return prisma.type.findMany()
  } catch (e) {
    throw e;
  }
};