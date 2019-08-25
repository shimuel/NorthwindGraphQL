import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const createClient = (token) => {

    token = localStorage.getItem('id_token');
    const client = new ApolloClient({
      link: new createHttpLink({
        uri: 'http://localhost:5000/graphql/',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/graphql',
          Authorization:  token ? `Bearer ${token}` : "",
          origin: 'https://localhost:3000',
        }
      }),
      cache: new InMemoryCache(),
    })
    
    return client
}

const authenticate = async (url = 'https://localhost:5001/users/authenticate', data = {"username":"test", "password":"test"}) => {
  // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', //*same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': 'https://localhost:3000',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => {
      
        if(response.status === 200){
            return response.json()      
      }else
        return false
    },error => {
        console.log(error);
        return false      
    })
    .then(response => {  
      if(response)        
          localStorage.setItem('id_token', response.token)          
          
      return Promise.resolve(!!response);
    })
}


export {
  createClient, authenticate
}

