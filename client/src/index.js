import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { AUTH_TOKEN } from './constants';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem(AUTH_TOKEN);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : null
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error(graphQLErrors);
    }
    if (networkError) {
      if (networkError.statusCode === 401) {
        localStorage.removeItem(AUTH_TOKEN);
      }
    }
  }
});
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
