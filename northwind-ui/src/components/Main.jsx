import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from "styled-components";

import Home  from './Home'
import First from './First';
import Second from './Second';
import Third from './Third';

const  Main = () => {         
    return (
      <Wrapper>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/first' component={First}/>
          <Route path='/second' component={Second}/>
          <Route exact path="/third" component={Third} />
        </Switch>
      </Wrapper> 
  )
}
const Wrapper = styled.div`
    // omitted
      section.route-section {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        border:solid 3px red;
      }
`;

export default Main
