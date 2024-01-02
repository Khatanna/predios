import { readFileSync } from "fs";
import { join } from "path";
import * as Subscription from "./subcriptions.subcriptions";
import * as Mutation from "./subcriptions.mutation";

export const resolvers = {
  Subscription,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
