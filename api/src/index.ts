import { config } from "dotenv";
import { app, httpsServer, server } from "./graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { graphqlContext } from "./utilities";
config();
async function main() {
  await server.start();
  app.use("/", expressMiddleware(server, { context: graphqlContext }));

  httpsServer.listen({ port: process.env.PORT ?? 3001 });

  console.log(`🚀 Server ready`);
}

main();
