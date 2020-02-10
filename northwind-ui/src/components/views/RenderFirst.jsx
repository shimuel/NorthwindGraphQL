import React from "react";
import { useState, useEffect, useMemo } from 'react';
import "../../App.css";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import  { GET_CUSTOMERS_PAGE, GET_PRODUCT_LIST, GET_REGION_LIST } from '../../graphql/queries'
import  {GridWrapper} from '../grid/GridWrapper'
import  {TestModal} from '../modals/TestModal'
const FirstView = () => {

  const [open, setOpen] = React.useState(false)

    let columns = new Map();

    columns.set("customerId", {
      header: 'Customer Id',
      accessor: 'customerId',
      minWidth: 150,
      isFilter:false,
      filterType:"",
      //editor:'EditableTextCell',
      //isSortable:false,              
      show:true,
      type:"string"
    })
    
    columns.set("companyName", {
        header: 'Company',
        accessor: 'companyName',
        minWidth: 150,
        isFilter:false,
        filterType:"",
        //editor:'EditableTextCell',
        //isSortable:false,              
        show:true,
        type:"string"
      })

    columns.set("contactName", {
        header: 'Contact',
        accessor: 'contactName',
        minWidth: 150,
        isFilter:false,
        filterType:"",
        //editor:'EditableTextCell',
        //isSortable:false,              
        show:true,
        type:"string"
    })

    const onDataRecieved = (previousData, nextData ) => {
      
        if(nextData){

            return nextData.customersPage.items.map(customer => {
              const { customerId:customerId, companyName:companyName, contactName:contactName } = customer
              const customerInfo = { customerId:customerId, companyName:companyName, contactName:contactName }
              return customerInfo
          })
        }else{
          //paging mode
          if(previousData &&  previousData.data.customersPage && previousData.data.customersPage.items) {

            return previousData.data.customersPage.items.map(customer => {
                const { customerId:customerId , companyName:companyName, contactName:contactName} = customer
                const customerInfo = { customerId:customerId, companyName:companyName, contactName:contactName }
                return customerInfo
            })
          }else if(previousData && previousData.data &&  previousData.data.customersPage &&  previousData.data.customersPage.items){
  
            return previousData.data.customersPage.items.map(customer => {
                const { customerId:customerId, companyName:companyName, contactName:contactName } = customer
                const customerInfo = { customerId:customerId, companyName:companyName, contactName:contactName}
                return customerInfo
            })
          }
        }
    }
      
    const gridState = {pageSize: 3,pageIndex:0}

    const ORDERS/*{ data, loading, error, fetchMore }*/ = useQuery(GET_CUSTOMERS_PAGE, {
        variables: {size: gridState.pageSize,index:gridState.pageSize}
    });

    
    const onCellClick =  (cellInfo) => {
      
      if (cellInfo) {
        console.log(`onCellClick....${JSON.stringify(cellInfo)}`)
      }
      return {};
    }
    const onRowClick =  (data, idx) => {
      
      if (data) {
        console.log(`onRowClick....${JSON.stringify(data)} row - ${idx}`)

        if(idx === 1){
          setOpen(true)
        }else{
          setOpen(false)
        }
      }
      return {};
    }

    const fetchPageCount = (data) => {
        return data.customersPage.pageCount; 
    }

    const fetchData = async  (p) =>{
      console.log(`sa,mmmmm...fetchData...${JSON.stringify(p)}`)
        return ORDERS.fetchMore({
            variables: {index:p.pageIndex, size:p.pageSize},
            updateQuery: (previous, { fetchMoreResult }) => {                                    
            console.log(`Calling updateQuery `)        
            console.log(JSON.stringify(p))
            }      
        })
    }
    
    if (ORDERS.loading) {
      console.log('loading..')
      return <div>Loading...</div>;
    }

    if (ORDERS.error) {
      console.log('error..')
      return <div>Error! {ORDERS.error.messaGridStylesge}</div>;
    }
    const renderChildModal = () => {
      return open ? <TestModal show={open} onHide={() => setOpen(false)} /> : null 
    }

    return (
        <div className="Home"> 
              {renderChildModal()}
            <GridWrapper       
                gridHeader='Customers'             
                gridCols={columns}
                initialSortColumn='companyName' 
                fetchMore={fetchData}
                fetchPageCount = {fetchPageCount}
                onDataRecieved={onDataRecieved} 
                initState ={gridState}
                rowClickCallback={onRowClick}
                cellClickCallback={onCellClick}/>     
        </div>
    )

    return <span>First Component</span>
}

export {
    FirstView
}

