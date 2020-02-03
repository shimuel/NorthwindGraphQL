import React from "react";
import "../../App.css";
import { useQuery } from "@apollo/react-hooks";
import  { GET_CUSTOMERS_PAGE } from '../../graphql/queries'
import  { EDIT_MODE, EDITMODE_METADATA } from '../grid/GridExtn'
import  {GridWrapper} from '../grid/GridWrapper'

const FirstView = () => {

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
    // companyName
    //   contactName
    columns.set(EDIT_MODE,EDITMODE_METADATA())

    const extractData = (previousData, nextData ) => {
      
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
      
    const gridPageSettings = {pageSize: 3,pageIndex:1}

    const { data, loading, error, fetchMore } = useQuery(GET_CUSTOMERS_PAGE, {
        variables: {size: gridPageSettings.pageSize,index:gridPageSettings.pageSize}
    });

    const fetchPageCount = (data) => {
        return data.customersPage.pageCount; 
    }
    
    const addData = () => {
        //return{companyName:"test",orderDate:"", shipVia:""}    
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
                gridHeader='Customers'             
                gridCols={columns}
                initialSortColumn='companyName' 
                fetchMore={fetchData}
                fetchPageCount = {fetchPageCount}
                onDataRecieved={extractData} 
                initState ={gridPageSettings}
                newItemCallback={addData}/>            
        </div>
    )

    return <span>First Component</span>
}

export {
    FirstView
}