import { State, Tracking, User } from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const createTracking = async (_parent: any, { propertyId, input: { observation, dateOfInit, numberOfNote, state, responsible } }: { propertyId: string, input: Tracking & { state: State, responsible: User } }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'CREATE', 'TRACKING');

    return prisma.tracking.create({
      data: {
        dateOfInit,
        observation,
        numberOfNote,
        responsible: {
          connect: {
            username: responsible.username
          }
        },
        state: {
          connect: {
            name: state.name
          }
        },
        property: {
          connect: {
            id: propertyId
          }
        }
      }
    })
  } catch (e) {
    throw e;
  }
};
export const deleteTracking = async (_parent: any, { propertyId, id }: { propertyId: string, id: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'DELETE', 'TRACKING');

    return prisma.tracking.delete({
      where: {
        id
      }
    })
  } catch (e) {
    throw e;
  }
};
export const updateTracking = async (_parent: any, { trackingId, input: { dateOfInit, numberOfNote, observation, state, responsible } }: { trackingId: string, input: Tracking & { state: State, responsible: User } }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'UPDATE', 'TRACKING');

    return prisma.tracking.update({
      where: {
        id: trackingId
      },
      data: {
        dateOfInit,
        numberOfNote,
        observation,
        state: {
          connect: {
            name: state.name
          }
        },
        responsible: {
          connect: {
            username: responsible.username
          }
        }
      }
    })
  } catch (e) {
    throw e;
  }
};