import React from 'react';
import ReactDOM from 'react-dom';


//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from "apollo-link";
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'


const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql/'
})

const headers = {
  'Access-Control-Allow-Origin': '*',
};

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})



ReactDOM.render(
  <ApolloProvider client={client}>   
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
serviceWorker.unregister();