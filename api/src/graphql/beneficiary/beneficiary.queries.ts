import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllBeneficiaries = (_parent: any, _args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'BENEFICIARY');

    return prisma.beneficiary.findMany({
      include: {
        properties: {
          include: {
            observations: true,
            activity: true,
            beneficiaries: true,
            clasification: true,
            groupedState: true,
            reference: true,
            type: true,
            users: true,
            responsibleUnit: true,
            state: true,
            subDirectory: true,
          }
        }
      }
    })
  } catch (e) {
    throw e
  }
}