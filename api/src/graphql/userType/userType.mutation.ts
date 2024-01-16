import { UserType } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createUserType = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "USERTYPE");
    return prisma.userType.create({ data: { name } });
  } catch (e) {
    throw e;
  }
};
export const deleteUserType = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "USERTYPE");
    return prisma.userType.delete({ where: { name } });
  } catch (e) {
    throw e;
  }
};
export const updateUserType = (
  _parent: any,
  { currentName, name }: { currentName: string; name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "USERTYPE");
    return prisma.userType.update({
      where: { name: currentName },
      data: { name },
    });
  } catch (e) {
    throw e;
  }
};
