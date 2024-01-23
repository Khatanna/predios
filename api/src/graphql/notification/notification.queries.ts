import { Context } from "../../types";

export const getAllNotifications = (
  _parent: any,
  _args: Record<string, string>,
  { prisma, userContext }: Context,
) => {
  try {
    console.log(userContext?.id);
    return prisma.notification.findMany({
      where: {
        to: {
          id: userContext?.id,
        },
      },
      include: {
        to: true,
        from: true,
        property: true,
      },
    });
  } catch (e) {
    throw e;
  }
};
