import { GraphQLArgs } from "graphql";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllProperties = async (_parent: any,
  _args: GraphQLArgs,
  { prisma, userContext }: Context,) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY")
    return prisma.property.findMany({
      include: {
        users: true,
        beneficiaries: {
          include: {
            properties: true
          }
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true
          }
        },
        type: true,
        subDirectory: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true
          }
        },
        city: true,
        province: true,
        municipality: true
      },
    });
  } catch (e) {
    throw e;
  }
};

export const getProperty = async (_parent: any, { nextCursor }: { nextCursor?: string }, context: Context) => {
  try {
    const property = await context.prisma.property.findFirstOrThrow({
      skip: nextCursor ? 1 : 0,
      cursor: nextCursor ? {
        id: nextCursor
      } : undefined,
      orderBy: {
        id: 'asc'
      },
      include: {
        users: true,
        beneficiaries: {
          include: {
            properties: true
          }
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true
          }
        },
        type: true,
        subDirectory: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true
          }
        },
        city: true,
        province: true,
        municipality: true
      },
    });

    return {
      nextCursor: property.id,
      property
    }
  } catch (e) {
    throw e;
  }
}
