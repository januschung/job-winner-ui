import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import './index.css';
import App from './App';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter } from 'react-router-dom';

// `npm run dev:mock` swaps the backend for an in-browser stub with demo data.
// The check is a build-time constant, so production builds drop the stub.
const createLink = async () =>
  import.meta.env.VITE_MOCK_API === 'true'
    ? (await import('./dev/mockApi')).createMockLink()
    : new HttpLink({
        uri: window.APP_CONFIG?.BACKEND_URL || 'http://localhost:8080/graphql',
      });

createLink().then(link => {
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    // Apollo 4 reports `loading` during every refetch by default. The UI
    // treats `loading` as "first load" (skeletons, badges, the interviews
    // tab), so keep refetches silent unless a query opts in.
    defaultOptions: { watchQuery: { notifyOnNetworkStatusChange: false } },
  });
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});
