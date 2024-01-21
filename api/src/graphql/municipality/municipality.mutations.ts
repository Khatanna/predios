import { Municipality, Province } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createMunicipality = (
  _parent: any,
  {
    input: { name, province },
  }: { input: { name: string; province: Pick<Province, "name"> } },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "MUNICIPALITY");

    return prisma.municipality.create({
      data: {
        name,
        province: {
          connect: {
            name: province.name,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
export const updateMunicipality = (
  _parent: any,
  {
    name,
    input,
  }: {
    name: string;
    input: { name: string; province: Pick<Province, "name"> };
  },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "UPDATE", "MUNICIPALITY");

    return prisma.municipality.update({
      where: {
        name,
      },
      data: {
        name: input.name,
        province: {
          connect: {
            name: input.province.name,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
export const deleteMunicipality = (
  _parent: any,
  { name }: { name: string },
  { userContext, prisma }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "MUNICIPALITY");

    return prisma.municipality.delete({
      where: {
        name,
      },
    });
  } catch (e) {
    throw e;
  }
};
