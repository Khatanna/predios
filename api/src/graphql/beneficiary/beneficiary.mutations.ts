import { Beneficiary } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createBeneficiary = (
  _parent: any,
  {
    propertyId,
    input,
  }: { propertyId: string; input: Pick<Beneficiary, "name"> },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "BENEFICIARY");
    return prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        beneficiaries: {
          connectOrCreate: {
            where: {
              name: input.name,
            },
            create: {
              name: input.name,
            },
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};

export const deleteBeneficiary = async (
  _parent: any,
  {
    propertyId,
    input,
    all,
  }: { propertyId: string; input: Pick<Beneficiary, "name">; all: boolean },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "BENEFICIARY");

    let result = all
      ? await prisma.beneficiary.delete({
          where: input,
        })
      : await prisma.property.update({
          where: {
            id: propertyId,
          },
          data: {
            beneficiaries: {
              disconnect: {
                name: input.name,
              },
            },
          },
        });
    console.log({ result });
    return Boolean(result);
  } catch (e) {
    throw e;
  }
};

export const updateBeneficiary = (
  _parent: any,
  { name, input }: { name: string; input: Pick<Beneficiary, "name"> },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "DELETE", "BENEFICIARY");

    return prisma.beneficiary.update({
      where: { name },
      data: input,
    });
  } catch (e) {
    throw e;
  }
};
