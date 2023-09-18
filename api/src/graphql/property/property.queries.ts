import { GraphQLArgs } from "graphql";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllProperties = async (_parent: any,
  _args: GraphQLArgs,
  { prisma, userContext }: Context,) => {
  try {
    // hasPermission(userContext, "READ", "PROPERTY")
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
        state: true,
        city: true,
        province: true,
        municipality: true
      },
    });
  } catch (e) {
    throw e;
  }
};
