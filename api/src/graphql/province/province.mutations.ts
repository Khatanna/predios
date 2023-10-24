import { Province } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createProvince = (
  _parent: any,
  { input: { name, code, cityName } }: { input: Province & { cityName: string } },
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
    name,
    item
  }: { name: string; item: Province },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "PROVINCE");

    return prisma.province.update({
      where: {
        name,
      },
      data: item
    });
  } catch (e) {
    throw e;
  }
};
export const deleteProvince = (
  _parent: any,
  {
    name
  }: { name: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "PROVINCE");

    return prisma.province.delete({
      where: {
        name
      }
    });
  } catch (e) {
    throw e;
  }
};
