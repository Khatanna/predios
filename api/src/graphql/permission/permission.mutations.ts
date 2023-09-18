import { Permission, PrismaClient } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

type Args = { input: Permission };

export const createPermission = async (
  _parent: any,
  { input: { name, description, resource, level, status } }: Args,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "PERMISSION");

    const permission = await prisma.permission.create({
      data: {
        name,
        description,
        resource,
        level,
        status,
      },
    });

    return {
      created: Boolean(permission),
      permission,
    };
  } catch (e) {
    throw e;
  }
};

export const updatePermission = async (
  _parent: any,
  { input: { name, description, resource, level, status } }: Args,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "PERMISSION");
    const permission = await prisma.permission.update({
      where: {
        resource_level: {
          resource,
          level,
        },
      },
      data: {
        name,
        description,
        status,
      },
    });

    return {
      updated: Boolean(permission),
      permission,
    };
  } catch (e) {
    throw e;
  }
};

export const updateStatePermission = async (
  _parent: any,
  { input: { resource, level, status } }: Args,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "PERMISSION");
    const permission = await prisma.permission.update({
      where: {
        resource_level: {
          resource,
          level,
        },
      },
      data: {
        status,
      },
    });

    return {
      updated: Boolean(permission),
      permission,
    };
  } catch (e) {
    throw e;
  }
};
