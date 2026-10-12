import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import './index.css';
import App from './App';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
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
  const client = new ApolloClient({ link, cache: new InMemoryCache() });
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
