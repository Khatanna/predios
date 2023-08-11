import { startStandaloneServer } from "@apollo/server/standalone";
import { config } from "dotenv";
import { server } from "./graphql";
import { graphqlContext as context } from "./utilities";
config();

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT ?? "3001") },
    context
  });

  console.log(`🚀 Server ready at: ${url}`);
}

main();
