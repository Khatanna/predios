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
import { prisma, pubSub, throwUnauthorizedError } from "../utilities";
import { getError } from "../utilities/getError";
import { throwPrismaError } from "../utilities/throwPrismaError";
import { schema } from "./schema";
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";

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
      "https://172.18.0.250:5173",
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
          connection: "ONLINE",
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
          connection: "OFFLINE",
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
    const unwrapError = unwrapResolverError(error);
    if (unwrapError instanceof Prisma.PrismaClientKnownRequestError) {
      const e = throwPrismaError(unwrapError);
      throw new GraphQLError(e.message);
    }

    if (unwrapError instanceof Prisma.PrismaClientInitializationError) {
      const errorMessage = getError(unwrapError.message)[
        unwrapError.errorCode ??
        unwrapError.message.includes(`Can't reach database server at`)
          ? "P1001"
          : "default"
      ];
      console.log({ errorMessage });
      throw new GraphQLError(errorMessage);
    }

    if (unwrapError instanceof TokenExpiredError) {
      throw new GraphQLError(`El token expiro vuelva a iniciar sesión`);
    }

    if (unwrapError instanceof JsonWebTokenError) {
      console.log(unwrapError.message);
      throw new GraphQLError(
        jsonWebTokenErrorMap[unwrapError.message] ??
          "Ocurrio al verificar el token",
      );
    }

    if (unwrapError instanceof NotBeforeError) {
      throw new GraphQLError(
        `Eres un viajero del tiempo, este token no ha sido generado aun`,
      );
    }

    if (unwrapError instanceof Error) {
      console.log({ unwrapError }, { type: "Error" });
      throw new GraphQLError(unwrapError.message);
    }

    if (error instanceof GraphQLError) {
      throw new GraphQLError(error.message);
    }

    return formattedError;
  },
});

const jsonWebTokenErrorMap: Record<string, string | undefined> = {
  "jwt must be provided": "Debe enviar un token",
  "invalid token": "Token inválido",
  "jwt malformed": "Estructura del token inválida",
  "jwt signature is required": "Firma requerida en el token",
  "invalid signature": "Firma del token inválida",
  "jwt audience invalid. expected: [OPTIONS AUDIENCE]":
    "Audiencia del token inválida",
  "jwt issuer invalid. expected: [OPTIONS ISSUER]": "Emisor del token inválido",
  "jwt id invalid. expected: [OPTIONS JWT ID]": "ID del token inválido",
  "jwt subject invalid. expected: [OPTIONS SUBJECT]":
    "Sujeto del token inválido",
};
