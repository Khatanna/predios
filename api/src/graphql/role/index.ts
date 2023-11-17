
import { readFileSync } from "fs";
import { join } from "path";
import * as Mutation from "./role.mutations";
import * as Query from "./role.queries";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
