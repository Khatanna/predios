import { Observation } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createObservation = (_parent: any, { propertyId, input: { observation } }: { propertyId: string, input: Observation }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'OBSERVATION');

    return prisma.observation.create({
      data: {
        observation,
        property: {
          connect: {
            id: propertyId
          }
        },
      }
    })
  } catch (e) {
    throw e;
  }
};
export const updateObservation = (_parent: any, { observationId, input: { observation } }: { observationId: string, input: Observation }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'OBSERVATION');

    return prisma.observation.update({
      where: {
        id: observationId
      },
      data: {
        observation,
      }
    })
  } catch (e) {
    throw e;
  }
};
export const deleteObservation = (_parent: any, { observationId }: { observationId: string }, { userContext, prisma }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'OBSERVATION');

    return prisma.observation.delete({
      where: {
        id: observationId
      }
    })
  } catch (e) {
    throw e;
  }
};