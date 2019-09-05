import React from 'react';
import ReactDOM from 'react-dom';


//import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks'
import { createClient,  authenticate } from './graphql/Client'
import 'semantic-ui-css/semantic.min.css';

let authenticated = false;

const loadApp = async () => {  
  //authenticated = await authenticate()  
  //if(authenticated){
    const client = createClient()
      ReactDOM.render(
        <ApolloProvider client={client}>   
          <App />
        </ApolloProvider>,
        document.getElementById('root')
      )        
  //}else{
  //  return <span>Authentication Failed</span>
  //}
}

loadApp ()
serviceWorker.unregister();
