import { Resource } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllRecords = async (
  _parent: any,
  { resource }: { resource?: Resource },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "RECORD");
    return prisma.record.findMany({
      include: { user: { include: { type: true } } },
      where: {
        resource
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    throw e;
  }
};
