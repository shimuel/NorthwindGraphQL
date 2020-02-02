import React from "react";
import "../../App.css";
import { useQuery } from "@apollo/react-hooks";
import  { GET_ORDERS_PAGE } from '../../graphql/queries'
import  { EDIT_MODE, EDITMODE_METADATA } from '../grid/GridExtn'
import  {GridWrapper} from '../grid/GridWrapper'

const OrdersView = () => {

    let columns = new Map();
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
    columns.set("orderId", {
              header: 'Order Id',
              accessor: 'orderId',
              minWidth: 150,
              isFilter:false,
              filterType:"",
              //editor:'EditableTextCell',
              isSortable:false,              
              show:true,
              type:"string"
            })
    columns.set("companyName", {
              header: 'Company Name',
              accessor: 'companyName',
              minWidth: 150,
              isFilter:true,
              filterType:"containsFilter",
              editor:'EditableTextCell',
              isSortable:false,              
              show:true,
              type:"string"
            })
    columns.set("shipVia", {
              header: 'Shipped by',
              accessor: 'shipVia',
              minWidth: 150,
              isFilter:false,
              filterType:"SelectColumnFilter",
              editor:'EditableListCell',
              isSortable:true,
              show:true,
              type:"string"
    })
    columns.set(EDIT_MODE,EDITMODE_METADATA())//To track a cols edit state// A checkbox for activating a edit    

    const extractData = (previousData, nextData ) => {
      
      if(nextData){
          return nextData.ordersPage.items.map(order => {
            const {customer:customer, orderDate:orderDate, orderId:orderId, shipViaNavigation:shipViaNavigation} = order
            const orderInfo = {companyName:customer.companyName, orderDate:orderDate, orderId:orderId, shipVia:shipViaNavigation.companyName}
            return orderInfo
        })
      }else{
        //paging mode
        if(previousData &&  previousData.data.ordersPage && previousData.data.ordersPage.items){
          return previousData.data.ordersPage.items.map(order => {
              const {customer:customer, orderDate:orderDate, orderId:orderId, shipViaNavigation:shipViaNavigation} = order
              const orderInfo = {companyName:customer.companyName, orderDate:orderDate, orderId:orderId, shipVia:shipViaNavigation.companyName}
              return orderInfo
          })
        }else if(previousData && previousData.data &&  previousData.data.ordersPage &&  previousData.data.ordersPage.items){

          return previousData.data.ordersPage.items.map(order => {
              const {customer:customer, orderDate:orderDate, orderId:orderId, shipViaNavigation:shipViaNavigation} = order
              const orderInfo =  {companyName:customer.companyName, orderDate:orderDate, orderId:orderId, shipVia:shipViaNavigation.companyName}
              return orderInfo
          })
        }
      }
    }

  const fetchPageCount = (data) => {
    return data.ordersPage.pageCount; 
  }
  
  const addData = () => {
    return{companyName:"test",orderDate:"", shipVia:""}    
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

  const gridPageSettings = {pageSize: 3,pageIndex:1}

  const { data, loading, error, fetchMore } = useQuery(/*GET_ORDERS*/GET_ORDERS_PAGE, {
    variables: {size: gridPageSettings.pageSize,index:gridPageSettings.pageSize}
  });


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
                    fetchPageCount = {fetchPageCount}
                    onDataRecieved={extractData} 
                    initState ={gridPageSettings}
                    newItemCallback={addData}/>            
        </div>
    )
}

export {
    OrdersView
}