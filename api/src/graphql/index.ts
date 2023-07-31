import { ApolloServer } from "@apollo/server";
import { resolvers as cityResolvers, typeDefs as cityTypeDefs } from "./city";
import {
  resolvers as municipalityResolvers,
  typeDefs as municipalityTypeDefs,
} from "./municipality";
import {
  resolvers as PermissionResolvers,
  typeDefs as permissionTypeDefs,
} from "./permission";
import {
  resolvers as provinceResolvers,
  typeDefs as provinceTypeDefs,
} from "./province";
import { resolvers as userResolvers, typeDefs as userTypeDefs } from "./user";

import { resolvers as authResolvers, typeDefs as authTypeDefs } from "./auth";

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
