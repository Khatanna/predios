import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllRecords = async (
  _parent: any,
  _args: any,
  { prisma, userContext }: Context,
) => {
  try {
    // hasPermission(userContext, "READ", "RECORD");
    return prisma.record.findMany({
      include: { user: { include: { type: true, permissions: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    throw e;
  }
};
