import React from "react";
import Header from './components/Header'
import Main from './components/Main'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from "history";

import "./App.css";


const history = createBrowserHistory()

const App = () =>
 (
    <>   
      <BrowserRouter history={history}>   
        <Header />    
        <Main />    
      </BrowserRouter>
    </>
)
 export default App

