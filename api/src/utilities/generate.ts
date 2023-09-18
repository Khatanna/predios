import fs from 'fs'
import path from 'path'

const name = process.argv[2];

const pathToTarget = path.join(__dirname, '../graphql', name)
fs.mkdir(pathToTarget, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("created succesfully")
})

fs.writeFileSync(path.join(pathToTarget, 'index.ts'), `
import { readFileSync } from "fs";
import { join } from "path";
import * as Mutation from "./${name}.mutations";
import * as Query from "./${name}.queries";

export const resolvers = {
  Query,
  Mutation,
};

export const typeDefs = readFileSync(join(__dirname, "./schema.graphql"), {
  encoding: "utf-8",
});
`);
fs.writeFileSync(path.join(pathToTarget, name.concat('.mutations.ts')), `export {};`);
fs.writeFileSync(path.join(pathToTarget, name.concat('.queries.ts')), `export {};`);
fs.writeFileSync(path.join(pathToTarget, 'schema.graphql'), `type ${name[0].toUpperCase() + name.slice(1)} { id: ID! }`);
