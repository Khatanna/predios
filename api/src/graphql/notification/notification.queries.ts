import { Context } from "../../types";

export const getAllNotifications = async (
  _parent: any,
  _args: Record<string, string>,
  { prisma, userContext }: Context,
) => {
  try {
    const notifications = await prisma.notification.findMany({
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
    return notifications.sort((a, b) => +b.timeAgo - +a.timeAgo);
  } catch (e) {
    throw e;
  }
};
