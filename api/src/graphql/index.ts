import { ApolloServer } from "@apollo/server";
import { resolvers as cityResolvers, typeDefs as cityTypeDefs } from "./city";
import {
  resolvers as municipalityResolvers,
  typeDefs as municipalityTypeDefs,
} from "./municipality";
import {
  resolvers as permissionResolvers,
  typeDefs as permissionTypeDefs,
} from "./permission";
import {
  resolvers as provinceResolvers,
  typeDefs as provinceTypeDefs,
} from "./province";
import { resolvers as userResolvers, typeDefs as userTypeDefs } from "./user";
import { resolvers as authResolvers, typeDefs as authTypeDefs } from "./auth";
import {
  resolvers as userTypeResolvers,
  typeDefs as userTypeTypeDefs,
} from "./userType";
import {
  resolvers as recordResolvers,
  typeDefs as recordTypeDefs,
} from "./record";
import {
  resolvers as propertyResolvers,
  typeDefs as propertyTypeDefs
} from './property'
import {
  resolvers as beneficiaryResolvers,
  typeDefs as beneficiaryTypeDefs
} from './beneficiary'
import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error";
import { unwrapResolverError } from "@apollo/server/errors";
import { throwPrismaError } from "../utilities/throwPrismaError";
import { throwUnauthorizedError } from "../utilities";
import { getError } from "../utilities/getError";
import { Code, Status } from "../constants";
export const server = new ApolloServer({
  typeDefs: [
    permissionTypeDefs,
    userTypeDefs,
    authTypeDefs,
    cityTypeDefs,
    provinceTypeDefs,
    municipalityTypeDefs,
    userTypeTypeDefs,
    recordTypeDefs,
    propertyTypeDefs,
    beneficiaryTypeDefs
  ],
  resolvers: [
    permissionResolvers,
    userResolvers,
    authResolvers,
    cityResolvers,
    provinceResolvers,
    municipalityResolvers,
    userTypeResolvers,
    recordResolvers,
    propertyResolvers,
    beneficiaryResolvers
  ],
  // introspection: false,
  // plugins: [ApolloServerPluginLandingPageDisabled()],
  formatError(formattedError, error) {
    // console.log(error)
    if (unwrapResolverError(error) instanceof Error) {
      console.log("error normal");
    }

    if (
      unwrapResolverError(error) instanceof Prisma.PrismaClientKnownRequestError
    ) {
      // const e = (unwrapResolverError(error) as Prisma.PrismaClientKnownRequestError)
      console.dir(unwrapResolverError(error))
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
