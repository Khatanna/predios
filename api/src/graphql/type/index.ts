
import { readFileSync } from "fs";
import { join } from "path";
import * as Mutation from "./type.mutations";
import * as Query from "./type.queries";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
