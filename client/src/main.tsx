import ReactDOM from 'react-dom/client';
import App from './App.routes.tsx';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner'
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { useAuthStore } from './state/useAuthStore.ts';
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    }
  }
});

loadDevMessages()
loadErrorMessages()

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL as string
})

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: accessToken
      }
    })
  }

  return forward(operation);
});

const client = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster visibleToasts={5} richColors expand closeButton />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </QueryClientProvider>
)
