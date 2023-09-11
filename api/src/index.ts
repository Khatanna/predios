import { startStandaloneServer } from "@apollo/server/standalone";
import { config } from "dotenv";
import { server } from "./graphql";
import { graphqlContext as context } from "./utilities";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import https from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
config();
async function main() {
  await server.start();
  const app = express();

  app.use(
    cors({
      origin: [
        "https://172.18.0.202:4153",
        "https://172.18.0.202:5173",
        "https://localhost:5173",
      ],
      credentials: true,
      methods: ["POST"],
    }),
  );
  app.use("/", express.json(), expressMiddleware(server, { context }));
  const httpServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
    },
    app,
  );
  httpServer.listen({ port: process.env.PORT ?? 3001 });
  // const { url } = await startStandaloneServer(, {
  //   listen: { port: parseInt(process.env.PORT ?? "3001") },
  //   context
  // });

  console.log(`🚀 Server ready`);
}

main();
