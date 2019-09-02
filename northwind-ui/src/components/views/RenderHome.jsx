import React from "react";
import "../../App.css";
import { useQuery } from "@apollo/react-hooks";
import  { GET_ORDERS } from '../../graphql/queries'
import  { GridWrapper, EDIT_MODE, EDITMODE_METADATA } from '../Grid'

const OrdersView = () => {

    let columns = new Map();

    columns.set(EDIT_MODE,EDITMODE_METADATA())//To track a cols edit state// A checkbox for activating a edit    
    columns.set("orderDate", {
              header: 'Order Date',
              accessor: 'orderDate',
              minWidth: 150,
              isFilter:false,
              filterType:"",
              editor:'EditableTextCell',
              isSortable:false,              
              show:true,
              type:"date"
            })
    columns.set("companyName", {
              header: 'First Name',
              accessor: 'companyName',
              minWidth: 150,
              isFilter:true,
              filterType:"containsFilter",
              editor:'EditableTextCell',
              isSortable:true,              
              show:true,
              type:"string"
            })
    columns.set("shipVia", {
              header: 'Last Name',
              accessor: 'shipVia',
              minWidth: 150,
              isFilter:false,
              filterType:"SelectColumnFilter",
              editor:'EditableListCell',
              isSortable:true,
              show:true,
              type:"string"
    })

    const extractData = (previousData, nextData ) => {

      if(nextData){
          return nextData.orders.map(order => {
            const {customer:customer, orderDate:orderDate, shipViaNavigation:shipViaNavigation} = order
            const orderInfo = {companyName:customer.companyName, orderDate:orderDate, shipVia:shipViaNavigation.companyName}
            return orderInfo
        })
      }else{
        //paging mode
        if(previousData && previousData.orders){
          return previousData.orders.map(order => {
              const {customer:customer, orderDate:orderDate, shipViaNavigation:shipViaNavigation} = order
              const orderInfo = {companyName:customer.companyName, orderDate:orderDate, shipVia:shipViaNavigation.companyName}
              return orderInfo
          })
        }else if(previousData && previousData.data){

          return previousData.data.orders.map(order => {
              const {customer:customer, orderDate:orderDate, shipViaNavigation:shipViaNavigation} = order
              const orderInfo =  {companyName:customer.companyName, orderDate:orderDate, shipVia:shipViaNavigation.companyName}
              return orderInfo
          })
        }
      }
    }

  const fetchData = async  (p) =>{
      return fetchMore({
        variables: {index:p.pageIndex, size:p.pageSize},
        updateQuery: (previous, { fetchMoreResult }) => {                                    
          console.log(`Calling updateQuery `)        
          console.log(JSON.stringify(p))
        }      
    })
  }
  
  const { data, loading, error, fetchMore } = useQuery(GET_ORDERS);

    if (loading) {
      console.log('loading..')
      return <div>Loading...</div>;
    }

    if (error) {
      console.log('error..')
      return <div>Error! {error.message}</div>;
    }

    return (
        <div className="Home">    
            <span>Test</span>       
            <GridWrapper                    
                    gridCols={columns}
                    initialSortColumn='companyName' 
                    fetchMore={fetchData}
                    onDataRecieved={extractData} 
                    initState ={ {pageSize: 3,pageIndex:0}}
                    rowCount={data.orders.length}/>            
        </div>
    )
}

export {
    OrdersView
}