import { Context } from "../../types";
import { hasPermission } from "../../utilities";
export const getAllUserTypes = (_parent: any, _args: any, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'USERTYPE');
    return prisma.userType.findMany({ orderBy: { createdAt: 'asc' }, include: { users: true } })
  } catch (e) {
    throw e;
  }
} 