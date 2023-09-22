
import { readFileSync } from "fs";
import { join } from "path";
import * as Mutation from "./groupedState.mutations";
import * as Query from "./groupedState.queries";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
