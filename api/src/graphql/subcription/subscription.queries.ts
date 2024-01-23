import { Context } from "../../types";

export const getSubscriptionsByUserName = (
  _parent: any,
  _args: Record<string, string>,
  { prisma, userContext }: Context,
) => {
  return prisma.subscription.findMany({
    where: {
      user: {
        username: userContext?.username,
      },
    },
    include: {
      user: true,
      property: true,
    },
  });
};
