import React from "react";
import "../../App.css";
import { useQuery } from "@apollo/react-hooks";
import  { GET_ORDERS } from '../../graphql/queries'
import  { GridWrapper } from '../Grid'

const OrdersView = () => {

    const { loading, error, data } = useQuery(GET_ORDERS);

    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error! {error.message}</div>;
    }
   
    const {orders} = data
  
    const columns = [
      {
        Header: 'Orders',
        columns: [
          {
            Header: 'Order Date',
            accessor: 'orderDate',
          },
          {
            Header: 'First Name',
            accessor: 'companyName',
          },
          {
            Header: 'Last Name',
            accessor: 'shipVia',
          }
        ],
      }
    ]
      
    const allOrds = orders.map(order => {
        const {customer:customer, orderDate:orderDate, shipViaNavigation:shipViaNavigation} = order
        const orderInfo = {companyName:customer.companyName, orderDate:orderDate, shipVia:shipViaNavigation.companyName}
        return orderInfo
    });

            
    return (
        <div className="Home">           
            <GridWrapper data = {allOrds} columns={columns} pageSize={5} initialSortColumn='companyName'/>            
        </div>
    )
}

export {
    OrdersView
}