import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createBeneficiary = async (_parent: any, { input: { name } }: { input: { name: string } }, { prisma, userContext }: Context) => {
  try {
    //hasPermission(userContext, 'CREATE', 'BENEFICIARY');

    const beneficiary = await prisma.beneficiary.create({
      data: {
        name
      },
      include: {
        properties: true,
      }
    })

    return {
      created: Boolean(beneficiary),
      beneficiary
    }
  } catch (e) {
    throw e;
  }
};

export const deleteBeneficiary = async (_parent: any, { input: { name } }: { input: { name: string } }, { prisma, userContext }: Context) => {
  try {
    //hasPermission(userContext, 'DELETE', 'BENEFICIARY')
    const beneficiary = await prisma.beneficiary.delete({
      where: {
        name
      },
      include: {
        properties: true
      }
    })
    return {
      deleted: Boolean(beneficiary),
      beneficiary
    };
  } catch (e) {
    throw e;
  }
}