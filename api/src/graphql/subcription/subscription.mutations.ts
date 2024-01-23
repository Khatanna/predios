import { Context } from "../../types";

export const subscribe = async (
  _parent: any,
  { propertyId }: { propertyId: string },
  { prisma, userContext }: Context,
) => {
  try {
    return Boolean(
      await prisma.subscription.create({
        data: {
          user: {
            connect: {
              username: userContext?.username,
            },
          },
          property: {
            connect: {
              id: propertyId,
            },
          },
        },
      }),
    );
  } catch (e) {
    throw e;
  }
};

export const unsubscribe = async (
  _parent: any,
  { propertyId }: { propertyId: string },
  { prisma, userContext }: Context,
) => {
  try {
    return Boolean(
      await prisma.subscription.delete({
        where: {
          propertyId_userId: {
            propertyId,
            userId: userContext!.id,
          },
        },
      }),
    );
  } catch (e) {
    throw e;
  }
};
