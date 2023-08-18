import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from '@graphql-tools/schema';
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
import { resolvers as UserTypeResolvers, typeDefs as UserTypeTypeDefs } from './userType'

export const server = new ApolloServer({
  typeDefs: [
    permissionTypeDefs,
    userTypeDefs,
    authTypeDefs,
    cityTypeDefs,
    provinceTypeDefs,
    municipalityTypeDefs,
    UserTypeTypeDefs,
  ],
  resolvers: [
    permissionResolvers,
    userResolvers,
    authResolvers,
    cityResolvers,
    provinceResolvers,
    municipalityResolvers,
    UserTypeResolvers,
  ],
});
