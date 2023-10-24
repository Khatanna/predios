import { Clasification } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllClasifications = (_parent: any, args: any, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'CLASIFICATION');
    return prisma.clasification.findMany({
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};

export const getClasification = (_parent: any, { name }: Pick<Clasification, 'name'>, { prisma, userContext }: Context) => {

  try {
    hasPermission(userContext, 'READ', 'CLASIFICATION');
    return prisma.clasification.findUniqueOrThrow({
      where: {
        name
      },
      include: {
        properties: true
      }
    })
  } catch (e) {
    throw e;
  }
};