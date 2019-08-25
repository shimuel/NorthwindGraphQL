import React, { useState } from "react";
import "../../App.css";

import { Container } from 'react-bootstrap';

import { Table } from 'element-react';
import 'element-theme-default';

import { useQuery } from '@apollo/react-hooks';
import  { GET_ORDERS } from '../../graphql/queries'

export const Home = () =>  {

  
  const { loading, error, data } = useQuery(GET_ORDERS);

  if (loading) return 'Loading...';
  if (error) return error

  const orders = data.orders.map(order => {
      const {customer:customer, orderDate:orderDate, shipViaNavigation:shipViaNavigation} = order
      const orderInfo = {companyName:customer.companyName, orderDate:orderDate, shipVia:shipViaNavigation.companyName}
      return orderInfo
  });

  const columns = [
    {
      label: "Order Date",
      prop: "orderDate",
      width: 200
    },
    {
      label: "Customer",
      prop: "companyName",
      width: 300
    },
    {
      label: "Shipping",
      prop: "shipVia"
    }
  ]
  
  const ordersInfo = {orders,columns} 
  console.log(ordersInfo);
    
  return (
      <Container>
        <div className="Home">
          <div className="lander">
            <h1>Scratch</h1>
            <p>A simple note taking app</p>
            <Table
              style={{width: '100%'}}
              columns={ordersInfo.columns}
              data={ordersInfo.orders}
            />
          </div>
        </div>
      </Container>
    )
}
