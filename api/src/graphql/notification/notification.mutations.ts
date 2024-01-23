import { Context } from "../../types";

export const toggleReadNotification = (
  _parent: any,
  { id, read }: { id: string; read: boolean },
  { prisma }: Context,
) => {
  try {
    return prisma.notification.update({
      where: {
        id,
      },
      data: {
        read,
      },
    });
  } catch (e) {
    throw e;
  }
};
