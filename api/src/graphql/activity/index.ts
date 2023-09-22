
import { readFileSync } from "fs";
import { join } from "path";
import * as Mutation from "./activity.mutations";
import * as Query from "./activity.queries";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
