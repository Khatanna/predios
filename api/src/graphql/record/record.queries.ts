import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const viewRecords = async (
  _parent: any,
  _args: any,
  { prisma, userContext }: Context,
) => {
  try {
    // hasPermission(userContext, "READ", "RECORD");
    return prisma.record.findMany({
      include: { user: true },
    });
  } catch (e) {
    throw e;
  }
};
