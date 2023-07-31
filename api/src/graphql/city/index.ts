import * as Mutation from "./city.mutations";
import * as Query from "./city.queries";

import { readFileSync } from "fs";
import { join } from "path";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
