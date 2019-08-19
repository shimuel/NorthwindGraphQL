import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

// import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import Container from "./components/Container";

const App = () => {
  return (
    <Router>
    <div>
      <Header />
      <Container />
    </div>
  </Router>
  );
}

export default App;
