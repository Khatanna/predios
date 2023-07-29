import { ApolloServer } from "@apollo/server";
import { typeDefs as userTypeDefs, resolvers as userResolvers } from "./user";
import {
  typeDefs as permissionTypeDefs,
  resolvers as PermissionResolvers,
} from "./permission";
import { typeDefs as cityTypeDefs, resolvers as cityResolvers } from "./cities";
import {
  typeDefs as provinceTypeDefs,
  resolvers as provinceResolvers,
} from "./provinces";
import {
  typeDefs as municipalityTypeDefs,
  resolvers as municipalityResolvers,
} from "./municipalities";

import { typeDefs as authTypeDefs, resolvers as authResolvers } from "./auth";

export const server = new ApolloServer({
  typeDefs: [
    permissionTypeDefs,
    userTypeDefs,
    authTypeDefs,
    cityTypeDefs,
    provinceTypeDefs,
    municipalityTypeDefs,
  ],
  resolvers: [
    PermissionResolvers,
    userResolvers,
    authResolvers,
    cityResolvers,
    provinceResolvers,
    municipalityResolvers,
  ],
});
