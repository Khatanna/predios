import ReactDOM from "react-dom/client";
import App from "./App.routes.tsx";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

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
    <App />
  </QueryClientProvider>,
);
