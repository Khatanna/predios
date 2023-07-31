import * as Mutation from "./auth.mutations";
import * as Query from "./auth.queries";

import { readFileSync } from "fs";
import { join } from "path";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
