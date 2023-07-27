import { startStandaloneServer } from "@apollo/server/standalone";
import { config } from "dotenv";
import { server } from "./graphql";

config();

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT ?? "3001") },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

main();
