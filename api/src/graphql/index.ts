import { ApolloServer } from "@apollo/server";
import { unwrapResolverError } from "@apollo/server/errors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Prisma, User } from "@prisma/client";
import cors from "cors";
import express from "express";
import fs from "fs";
import { useServer } from "graphql-ws/lib/use/ws";
import { GraphQLError } from "graphql/error";
import https from "https";
import path from "path";
import { WebSocketServer } from "ws";
import { Code, Status } from "../constants";
import { prisma, pubSub, throwUnauthorizedError } from "../utilities";
import { getError } from "../utilities/getError";
import { throwPrismaError } from "../utilities/throwPrismaError";
import { schema } from "./schema";

export const app = express();
export const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../cert.pem")),
  },
  app,
);

app.use(
  cors({
    origin: [
      "https://172.18.0.202:4173",
      "https://172.18.0.202:5173",
      "https://192.168.100.2:5173",
      "https://localhost:5173",
      // "https://localhost:4173",
    ],
    credentials: true,
    // methods: ["POST", "OPTION", "GET"],
  }),
);
app.use(express.json());
const wsServer = new WebSocketServer({
  server: httpsServer,
  path: "/",
});

const serverCleanup = useServer(
  {
    schema,
    async onConnect({ connectionParams }) {
      const { user } = connectionParams as { user: User };
      if (!user.username) return;
      console.log("usuario conectado: ", { user });
      await prisma.user.update({
        where: {
          username: user.username,
        },
        data: {
          connection: "ONLINE",
        },
      });
      await pubSub.publish("USER_CONNECTED", {
        userConnected: {
          username: user.username,
          connected: true,
        },
      });
    },
    async onDisconnect({ connectionParams }) {
      const { user } = connectionParams as { user: User };
      if (!user.username) return;
      console.log("usuario desconectado: ", { user });
      await prisma.user.update({
        where: {
          username: user.username,
        },
        data: {
          connection: "OFFLINE",
        },
      });
      const count = await prisma.position.count();
      if (count > 0) {
        await prisma.position.delete({ where: { username: user.username } });
      }
      await pubSub.publish("USER_CONNECTED", {
        userConnected: {
          username: user.username,
          connected: false,
        },
      });
    },
    // retirar prisma para conservar la seguridad
    context: () => {
      return {
        prisma,
        pubSub,
      };
    },
  },
  wsServer,
);
export const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer: httpsServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  // introspection: false,
  // plugins: [ApolloServerPluginLandingPageDisabled()],
  formatError(formattedError, error) {
    if (unwrapResolverError(error) instanceof Error) {
      console.log("error normal");
    }

    if (
      unwrapResolverError(error) instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw throwPrismaError(
        unwrapResolverError(error) as Prisma.PrismaClientKnownRequestError,
      );
    }

    if (
      unwrapResolverError(error) instanceof
      Prisma.PrismaClientInitializationError
    ) {
      const e = unwrapResolverError(
        error,
      ) as Prisma.PrismaClientInitializationError;

      const errorMessage = getError(e.message)[
        e.errorCode ?? e.message.includes(`Can't reach database server at`)
          ? "P1001"
          : "default"
      ];
      throw new GraphQLError(errorMessage, {
        extensions: {
          code: Code.BAD_REQUEST,
          http: { status: Status.BAD_REQUEST },
        },
      });
    }

    if (error instanceof GraphQLError) {
      console.log(error);
      throw throwUnauthorizedError(error.message);
    }

    return formattedError;
  },
});
