import { Context } from "../../types";

export const userPermissionStatusUpdated = {
  subscribe: (_parent: any, args: any, { pubSub }: Context) =>
    pubSub.asyncIterator(["USER_PERMISSION_STATUS_UPDATED"]),
};

export const userConnected = {
  subscribe: (_parent: any, args: any, { pubSub }: Context) =>
    pubSub.asyncIterator("USER_CONNECTED"),
};

export const cursorMove = {
  subscribe: (_parent: any, args: any, { pubSub }: Context) =>
    pubSub.asyncIterator("CURSOR_MOVE"),
};

export const focusedInput = {
  subscribe: (_parent: any, args: any, { pubSub }: Context) =>
    pubSub.asyncIterator("FOCUSED_INPUT"),
};

export const changeInput = {
  subscribe: (_parent: any, args: any, { pubSub }: Context) =>
    pubSub.asyncIterator("CHANGE_INPUT"),
};
