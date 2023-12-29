import { Context } from "../../types";

export const cursorMove = (
  _parent: any,
  {
    username,
    positionX,
    positionY,
  }: { username: string; positionX: number; positionY: number },
  { pubSub }: Context,
) => {
  try {
    if (username && positionX && positionY) {
      return pubSub.publish("CURSOR_MOVE", {
        cursorMove: {
          username,
          positionX,
          positionY,
        },
      });
    }

    return "error";
  } catch (e) {
    throw e;
  }
};
