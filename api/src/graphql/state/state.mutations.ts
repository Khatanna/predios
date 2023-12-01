import { State, Stage } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createState = (_parent: any, { input: { name, stage } }: { input: State & { stage: Stage } }, { userContext, prisma }: Context) => {
  // console.log({
  //   name,
  //   order,
  //   stage
  // })

  try {
    hasPermission(userContext, 'CREATE', 'STATE')
    return prisma.state.create({
      data: {
        name,
        stage: {
          connect: stage
        }
      }
    })
  } catch (e) {
    throw e;
  }
};

export const updateState = (_parent: any, { name, item }: { name: string, item: State & { stage: Stage } }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'STATE')
    return prisma.state.update({
      where: {
        name
      },
      data: {
        name: item.name,
        /// order: item.order,
        stage: {
          connect: item.stage
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
