import React, { useState } from "react";
import "../../App.css";

import { Container } from 'react-bootstrap';

import { Table } from 'element-react';
import 'element-theme-default';

import { useQuery } from '@apollo/react-hooks';
import  { GET_ORDERS } from '../../graphql/queries'

export const Home = () =>  {

  const [getData, setData] = useState({
    columns: [
      {
        label: "Date",
        prop: "date",
        width: 180
      },
      {
        label: "Name",
        prop: "name",
        width: 180
      },
      {
        label: "Address",
        prop: "address"
      }
    ],
    data: [{
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }, {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }, {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }, {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }]
  })


  const { loading, error, data } = useQuery(GET_ORDERS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

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
