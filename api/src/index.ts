import { startStandaloneServer } from "@apollo/server/standalone";
import { config } from "dotenv";
import { server } from "./graphql";
import { GraphQLError } from "graphql";

config();

async function getUser(token: string) {
  if(token === 'uwu') {
    return {
      name: 'user'
    }
  }

  return undefined;
} 

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT ?? "3001") },
    // context: async({ req, res }) => {
    //   const token = req.headers.authorization as string
    //   const user = await getUser(token);
          
    //   if (!user)
    //   // throwing a `GraphQLError` here allows us to specify an HTTP status code,
    //   // standard `Error`s will have a 500 status code by default
    //   throw new GraphQLError('User is not authenticated', {
    //     extensions: {
    //       code: 'UNAUTHENTICATED',
    //       http: { status: 401 },
    //     },
    //   });

    //   return { user };
    // }
  });

  console.log(`🚀 Server ready at: ${url}`);
}

main();
