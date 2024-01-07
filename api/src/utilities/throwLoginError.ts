import { GraphQLError } from "graphql";

export const throwLoginError = (message: string): GraphQLError => {
  return new GraphQLError(message);
};
