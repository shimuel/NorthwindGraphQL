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
import { createClient,  authenticate } from './graphql/Client'

let pass = false;
const loadApp = async () => {  
  pass = await authenticate()  
  if(pass){
    const client = createClient()
      ReactDOM.render(
        <ApolloProvider client={client}>   
          <App />
        </ApolloProvider>,
        document.getElementById('root')
      )  
      serviceWorker.unregister();
  }
}

loadApp ()
