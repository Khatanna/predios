import { LevelPermission, Resource } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

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

export const deletePermissionForRole = async (_parent: any,
  { role, permission }: { role: string; permission: { resource: Resource, level: LevelPermission } },
  { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'PERMISSION')

    const permissionFinded = await prisma.permission.findUniqueOrThrow({
      where: {
        resource_level: {
          level: permission.level,
          resource: permission.resource
        }
      },
      select: {
        id: true
      }
    })

    const roleFinded = await prisma.role.findFirstOrThrow({
      where: {
        name: role
      }, select: { id: true }
    })

    // prisma.$executeRawUnsafe()
    await prisma.roleHasPermission.delete({
      where: {
        roleId_permissionId: {
          roleId: roleFinded.id,
          permissionId: permissionFinded.id
        }
      }
    })

    return prisma.role.findUnique({
      where: {
        name: role,
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
  } catch (e) {
    throw e;
  }
}