import ReactDOM from "react-dom/client";
import App from "./App.routes.tsx";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { client } from "./config/wsClient.ts";
import { ApolloProvider } from "@apollo/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster visibleToasts={5} richColors expand closeButton />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </QueryClientProvider>,
);
