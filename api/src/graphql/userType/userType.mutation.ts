import { UserType } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createUserType = (
  _parent: any,
  { input }: { input: UserType },
  { userContext, prisma }: Context
) => {
  try {
    hasPermission(userContext, 'CREATE', 'USERTYPE');
    return prisma.userType.create({ data: input });
  } catch (e) {
    throw e;
  }
};
