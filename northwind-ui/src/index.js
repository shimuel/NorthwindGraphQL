import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from "history";

//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'


const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

const history = createBrowserHistory()

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter history={history}>
    <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
serviceWorker.unregister();