import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import {
  resolvers as activityResolvers,
  typeDefs as activityTypeDefs
} from './activity';
import { resolvers as authResolvers, typeDefs as authTypeDefs } from "./auth";
import {
  resolvers as beneficiaryResolvers,
  typeDefs as beneficiaryTypeDefs
} from './beneficiary';
import { resolvers as cityResolvers, typeDefs as cityTypeDefs } from "./city";
import {
  resolvers as clasificationResolvers, typeDefs as clasificationTypeDefs
} from './clasification';
import {
  resolvers as groupedStateResolvers, typeDefs as groupedStateTypeDefs
} from './groupedState';
import {
  resolvers as municipalityResolvers,
  typeDefs as municipalityTypeDefs,
} from "./municipality";
import {
  resolvers as observationResolvers,
  typeDefs as observationTypeDefs
} from './observation';
import {
  resolvers as permissionResolvers,
  typeDefs as permissionTypeDefs,
} from "./permission";
import {
  resolvers as propertyResolvers,
  typeDefs as propertyTypeDefs
} from './property';
import {
  resolvers as provinceResolvers,
  typeDefs as provinceTypeDefs,
} from "./province";
import {
  resolvers as recordResolvers,
  typeDefs as recordTypeDefs,
} from "./record";
import {
  resolvers as referenceResolvers, typeDefs as referenceTypeDefs
} from './reference';
import {
  resolvers as responsibleUnitResolvers, typeDefs as responsibleUnitTypeDefs
} from './responsibleUnit';
import {
  resolvers as stageResolvers, typeDefs as stageTypeDefs
} from './stage';
import {
  resolvers as stateResolvers, typeDefs as stateTypeDefs
} from './state';
import { resolvers as subDirectoryResolvers, typeDefs as subDirectoryTypeDefs } from './subDirectory';
import {
  resolvers as typeResolvers, typeDefs as typeTypeDefs
} from './type';
import { resolvers as userResolvers, typeDefs as userTypeDefs } from "./user";
import {
  resolvers as userTypeResolvers,
  typeDefs as userTypeTypeDefs,
} from "./userType";
import {
  typeDefs as technicalOnPropertyTypeDefs,
  resolvers as technicalOnPropertyResolvers
} from './technicalOnProperty'
import {
  typeDefs as legalOnPropertyTypeDefs,
  resolvers as legalOnPropertyResolvers
} from './legalOnProperty'
import {
  resolvers as subscriptionsResolvers,
  typeDefs as subscriptionsTypeDefs
} from './subscriptions'

export const schema = makeExecutableSchema({
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
    beneficiaryTypeDefs,
    activityTypeDefs,
    observationTypeDefs,
    typeTypeDefs,
    clasificationTypeDefs,
    stateTypeDefs,
    stageTypeDefs,
    groupedStateTypeDefs,
    referenceTypeDefs,
    responsibleUnitTypeDefs,
    subDirectoryTypeDefs,
    subscriptionsTypeDefs,
    technicalOnPropertyTypeDefs,
    legalOnPropertyTypeDefs
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
    beneficiaryResolvers,
    activityResolvers,
    observationResolvers,
    typeResolvers,
    clasificationResolvers,
    stateResolvers,
    stageResolvers,
    groupedStateResolvers,
    referenceResolvers,
    responsibleUnitResolvers,
    subDirectoryResolvers,
    subscriptionsResolvers,
    technicalOnPropertyResolvers,
    legalOnPropertyResolvers
  ],
});