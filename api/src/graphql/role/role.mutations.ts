import { LevelPermission, Resource } from "@prisma/client";
import { Context } from "../../types";

type PermissionInput = {
  resource: Resource;
  levels: LevelPermission[];
};

export const createPermissionForRole = async (
  _parent: any,
  { role, permissions }: { role: string; permissions: PermissionInput[] },
  { prisma, userContext }: Context,
) => {
  try {
    const permissionIds: string[] = [];

    for (let permission of permissions) {
      for (let level of permission.levels) {
        const permissionFinded = await prisma.permission.findUniqueOrThrow({
          where: {
            resource_level: {
              resource: permission.resource,
              level: level,
            },
          },
        });

        permissionIds.push(permissionFinded.id);
      }
    }
    console.log(permissionIds);
    return prisma.role.update({
      where: {
        name: role,
      },
      data: {
        permissions: {
          createMany: {
            data: permissionIds.map((permissionId) => ({
              permissionId,
              assignedBy: userContext!.username,
            })),
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
