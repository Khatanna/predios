import { Context } from "../../types";

export const cursorMove = async (
  _parent: any,
  {
    contextId,
    username,
    positionX,
    positionY,
  }: {
    contextId: string;
    username: string;
    positionX: number;
    positionY: number;
  },
  { pubSub, prisma, userContext }: Context,
) => {
  try {
    if (!username) return;
    await prisma.position.upsert({
      where: {
        username,
      },
      update: {
        contextId,
        positionX,
        positionY,
      },
      create: {
        username,
        contextId,
        positionX,
        positionY,
      },
    });

    const cursors = await prisma.position.findMany({});
    return pubSub.publish("CURSOR_MOVE", {
      cursorMove: cursors,
    });
  } catch (e) {
    throw e;
  }
};
export const focusInput = (
  _parent: any,
  {
    contextId,
    name,
    isFocused,
  }: { contextId: string; name: string; isFocused: boolean },
  { pubSub, userContext }: Context,
) => {
  try {
    return pubSub.publish("FOCUSED_INPUT", {
      focusedInput: {
        contextId,
        name,
        isFocused,
        username: userContext?.username,
      },
    });
  } catch (e) {
    throw e;
  }
};
export const changeInput = (
  _parent: any,
  { name, value }: { name: string; value: string },
  { pubSub, userContext }: Context,
) => {
  try {
    if (name) {
      return pubSub.publish("CHANGE_INPUT", {
        changeInput: {
          name,
          value,
        },
      });
    }

    return "error";
  } catch (e) {
    throw e;
  }
};
