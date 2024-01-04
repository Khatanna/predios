import { Beneficiary } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createBeneficiary = (_parent: any, { propertyId, input }: { propertyId: string, input: Pick<Beneficiary, 'name'> }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'BENEFICIARY');
    return prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        beneficiaries: {
          connectOrCreate: {
            where: {
              name: input.name
            },
            create: {
              name: input.name
            }
          }
        }
      }
    })
    // return prisma.beneficiary.create({
    //   data: {
    //     ...input,
    //     properties: {
    //       connect: {
    //         id: propertyId
    //       }
    //     }
    //   }
    // })
  } catch (e) {
    throw e;
  }
};

export const deleteBeneficiary = (_parent: any, { input }: { input: Pick<Beneficiary, 'name'> }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'BENEFICIARY')

    return prisma.beneficiary.delete({
      where: input
    })
  } catch (e) {
    throw e;
  }
}

export const updateBeneficiary = (_parent: any, { name, input }: { name: string, input: Pick<Beneficiary, 'name'> }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'BENEFICIARY')

    return prisma.beneficiary.update({
      where: { name },
      data: input
    })
  } catch (e) {
    throw e;
  }
}