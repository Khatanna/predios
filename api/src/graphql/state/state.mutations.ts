import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createState = (_parent: any, { name, order, stageId }: { name: string, order: string, stageId: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'STATE')
    return prisma.state.create({
      data: {
        name,
        order,
        stageId
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateState = (_parent: any, { name, data }: { name: string, data: { name: string, order: string, stageId: string } }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'STATE')
    return prisma.state.update({
      where: {
        name
      },
      data
    })
  } catch (e) {
    throw e;
  }
};

export const deleteState = (_parent: any, { name }: { name: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'STATE')
    return prisma.state.delete({
      where: {
        name
      }
    }
    )
  } catch (e) {
    throw e;
  }
};
