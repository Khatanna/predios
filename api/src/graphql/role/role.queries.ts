import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllRoles = async (
  _parent: any,
  args: any,
  { prisma, userContext }: Context,
) => {
  try {
    // hasPermission(userContext, 'READ')
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
export const getRole = async (
  _parent: any,
  { name }: { name: string },
  { prisma, userContext }: Context,
) => {
  try {
    // hasPermission(userContext, 'READ')
    return prisma.role.findUnique({
      where: {
        name,
      },
      include: {
        permissions: {
          where: {
            NOT: {
              permission: {
                resource: "RECORD",
              },
            },
          },
          include: {
            permission: true,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
