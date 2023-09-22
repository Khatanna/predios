
import { readFileSync } from "fs";
import { join } from "path";
import * as Mutation from "./subDirectory.mutations";
import * as Query from "./subDirectory.queries";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
