import { readFileSync } from "fs";
import { join } from "path";
import * as Subscription from "./subcriptions.subcriptions";

export const resolvers = {
  Subscription
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
