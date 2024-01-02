import { AxiosInstance } from "axios";
import { createContext, useRef } from "react";
import { useAuth, useAxios } from "../hooks";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { useAuthStore } from "../state/useAuthStore";

export const AxiosContext = createContext<AxiosInstance | null>(null);

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

const client = new ApolloClient({
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

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AxiosInstance | null>(null);
  const axios = useAxios();
  if (!storeRef.current) {
    storeRef.current = axios;
  }

  return (
    <AxiosContext.Provider value={storeRef.current}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AxiosContext.Provider>
  );
};
