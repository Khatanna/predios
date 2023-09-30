import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllBeneficiaries = (_parent: any, args: { name?: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'BENEFICIARY');
    const getByName = args.name ? {
      where: {
        name: {
          contains: args.name
        }
      },
      take: 10
    } : undefined;
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
            responsibleUnit: true,
            state: true,
            subDirectory: true,
          }
        }
      },
      ...getByName,
    })
  } catch (e) {
    throw e
  }
}
