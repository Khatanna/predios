import ReactDOM from 'react-dom/client'
import App from './App.routes.tsx'
import './index.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const queryClient = new QueryClient();
const client = new ApolloClient({
  uri: 'http://localhost:3001',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ApolloProvider>
)
