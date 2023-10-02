import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createProvince = (
  _parent: any,
  { name, code, cityName }: { name: string; code: string; cityName: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "PROVINCE");

    return prisma.province.create({
      data: {
        name,
        code,
        city: {
          connect: {
            name: cityName,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
export const updateProvince = (
  _parent: any,
  {
    currentName,
    newName,
    code,
  }: { currentName: string; newName: string; code: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "PROVINCE");

    return prisma.province.update({
      where: {
        name: currentName,
      },
      data: {
        name: newName,
        code,
      },
    });
  } catch (e) {
    throw e;
  }
};
