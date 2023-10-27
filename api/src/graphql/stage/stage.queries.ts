import { Context } from '../../types';
import { hasPermission } from '../../utilities';
export const getAllStages = (_parent: any, args_: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'STAGE');
    return prisma.stage.findMany()
  } catch (e) {
    throw e;
  }
};
export const getStage = (_parent: any, { name }: { name: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'STAGE');
    return prisma.stage.findUniqueOrThrow({
      where: {

        name
      }
    })
  } catch (e) {
    throw e;
  }
};