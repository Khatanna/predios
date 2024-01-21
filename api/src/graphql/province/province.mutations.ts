import { City, Province } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createProvince = (
  _parent: any,
  {
    input: { name, code, city },
  }: { input: Province & { city: Pick<City, "name"> } },
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
            name: city.name,
          },
        },
      },
      include: {
        city: true,
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
    input: { name: newName, code, city },
  }: { name: string; input: Province & { city: Pick<City, "name"> } },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "PROVINCE");

    return prisma.province.update({
      where: {
        name,
      },
      data: {
        name: newName,
        code,
        city: {
          connect: {
            name: city.name,
          },
        },
      },
      include: {
        city: true,
      },
    });
  } catch (e) {
    throw e;
  }
};
export const deleteProvince = (
  _parent: any,
  { name }: { name: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "PROVINCE");

    return prisma.province.delete({
      where: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
