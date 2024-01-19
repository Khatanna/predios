import { Unit } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createUnit = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "UNIT");
    return prisma.unit.create({
      data: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const updateUnit = (
  _parent: any,
  { currentName, name }: { currentName: string; name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "UNIT");
    return prisma.unit.update({
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

export const deleteUnit = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "UNIT");
    return prisma.unit.delete({
      where: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
