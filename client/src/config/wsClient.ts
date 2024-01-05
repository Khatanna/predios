import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { useAuthStore } from "../state/useAuthStore";
import { getMainDefinition } from "@apollo/client/utilities";

loadDevMessages();
loadErrorMessages();

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL as string,
});

const wssLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_WS_URL as string,
    connectionParams() {
      return { user: { username: useAuthStore.getState().user?.username } };
    },
  }),
);

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: accessToken,
      },
    });
  }

  return forward(operation);
});

export const client = new ApolloClient({
  link: authMiddleware.split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wssLink,
    httpLink,
  ),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
