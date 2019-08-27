import React from "react";
import "../../App.css";
import { useQuery } from "@apollo/react-hooks";
import  { GET_ORDERS } from '../../graphql/queries'
import  { RenderOrders } from '../homeRenderers'

const LoadOrders = () => {

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
      
      const allOrds = orders.map(order => {
        const {customer:customer, orderDate:orderDate, shipViaNavigation:shipViaNavigation} = order
        const orderInfo = {companyName:customer.companyName, orderDate:orderDate, shipVia:shipViaNavigation.companyName}
        return orderInfo
      });

            
    return (
        <div className="Home">           
            <RenderOrders orders = {{allOrds, columns}}/>            
        </div>
    )
}

export {
    LoadOrders
}