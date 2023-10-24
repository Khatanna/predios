import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createState = (_parent: any, { input: { name, order, stageName } }: { input: { name: string, order: string, stageName: string } }, { userContext, prisma }: Context) => {
  console.log({
    name,
    order,
    stageName
  })

  try {
    hasPermission(userContext, 'CREATE', 'STATE')
    return prisma.state.create({
      data: {
        name,
        order,
        stage: {
          connect: {
            name: stageName
          }
        }
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateState = (_parent: any, { name, input }: { name: string, input: { name: string, order: string, stageName: string } }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'STATE')
    return prisma.state.update({
      where: {
        name
      },
      data: {
        name: input.name,
        order: input.order,
        stage: {
          connect: {
            name: input.stageName
          }
        }
      }
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
