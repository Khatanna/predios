import { GraphQLError } from "graphql";
import { Code, Status } from "../constants";

export const throwUnauthorizedError = (message: string): GraphQLError => {
  return new GraphQLError(message);
}