
import styled from "styled-components";
import React, { useState } from "react";
import "../../App.css";

import { Container } from 'react-bootstrap';
import { FirstView } from '../views/RenderFirst';

function First() {
  return (
    <Container>
    <div className="Home">
      <div className="lander">
        <h1>First</h1>
        <p>A simple note taking app</p>      
          <FirstView/>
      </div>
    </div>
  </Container>
  );
}

const Wrapper = styled.div`
    /* omitted */
`;

export default First;


