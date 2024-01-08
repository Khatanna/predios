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
import { onError } from "@apollo/client/link/error";

loadDevMessages();
loadErrorMessages();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) {
    if (networkError.message === "") {
      networkError.message = "Error de conexión con el servidor";
    }
  }
});

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
  link: errorLink.concat(
    authMiddleware.split(
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
  ),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
