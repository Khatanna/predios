import { Activity } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createActivity = (
  _parent: any,
  { name }: { name: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "ACTIVITY");

    return prisma.activity.create({
      data: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
export const updateActivity = (
  _parent: any,
  { currentName, name }: { currentName: string; name: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "ACTIVITY");

    return prisma.activity.update({
      where: {
        name: currentName,
      },
      data: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
export const deleteActivity = (
  _parent: any,
  { name }: { name: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "ACTIVITY");
    return prisma.activity.delete({
      where: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
