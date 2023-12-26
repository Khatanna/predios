import { Context } from "../../types";

export const createPermissionForRole = (_parent: any, { role, permissions }: { role: string, permissions: any }, { prisma, userContext }: Context) => {
  try {
    console.log({
      role, permissions
    })


    prisma.role.update({
      where: {
        name: role
      },
      data: {
        permissions: {
          createMany: {
            data: [
              {
                permissionId: '',
                assignedBy: userContext!.username
              }
            ]
          }
        }
      }
    })
    return prisma.role.findUnique({
      where: {
        name: role
      }
    })
  } catch (e) {
    throw e;
  }
};