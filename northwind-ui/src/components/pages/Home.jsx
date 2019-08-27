import React, { useState } from "react";
import "../../App.css";

import { Container } from 'react-bootstrap';
import { LoadOrders } from '../loaders/homeloaders';

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';


export const Home = () =>  {

  return (
      <Container>
        <LoadOrders />
      </Container>
  )
}


