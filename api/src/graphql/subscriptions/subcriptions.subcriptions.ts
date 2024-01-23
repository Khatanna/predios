import { Context } from "../../types";
import { withFilter } from "graphql-subscriptions";
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

export const propertyChange = {
  subscribe: withFilter(
    (_parent: any, args: any, { pubSub }: Context) => {
      return pubSub.asyncIterator("CHANGE_PROPERTY");
    },
    (payload, variables) => {
      return (
        payload.propertyChange.to.username === variables.username &&
        payload.propertyChange.from.username !== variables.username
      );
    },
  ),
};
