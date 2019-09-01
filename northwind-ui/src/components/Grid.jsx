import React, { useState, useEffect,     useMemo } from 'react';
import styled from "styled-components";
import "../App.css";
import { Table,  Icon, Label, Menu, Dropdown} from 'semantic-ui-react'
import {
    useTable,
    useGroupBy,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useRowState,
    useTableState

  } from 'react-table'
import matchSorter from 'match-sorter'
import { useQuery } from "@apollo/react-hooks";


const Grid = ({
      gridCols, 
      data, 
      initialState,  
      fetchData, 
      loading,
      pageCount:controlledPageCount
    }) => {
     
      const tableState = useTableState(initialState)
      const [{ pageIndex, pageSize }] = tableState
      
      // Listen for changes in pagination and use the state to fetch our new data
      React.useEffect(
        () => {
          fetchData({ pageIndex, pageSize })
        },
        [pageIndex, pageSize]
      )
      const columns = React.useMemo(
        () => [{
            Header: 'Orders',
            columns: gridCols,
          }
        ],
        []
      )            
      
      //const myData = React.useMemo(() => props.data, [])                    
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
    } =  useTable(
      {
        columns,
        data,
        state:tableState,
        manualPagination: true, // Tell the usePagination
        // hook that we'll handle our own data fetching
        // This means we'll also have to provide our own
        // pageCount.
        pageCount: controlledPageCount,         
      },     
      usePagination,
  )    
 
  const myRowFunc = (row) => {        
    return <Table.Row {...row.getRowProps()}>
                {row.cells.map(cell => {
                    return (
                        <Table.Cell {...cell.getCellProps()}>
                            {
                                cell.render('Cell')
                            }                                                                    
                        </Table.Cell>
                    )
                })}
            </Table.Row>
  }
 
    // Render the UI for your table
    return (
        <>
        <pre>
            <code>
            {JSON.stringify(
                {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
                },
                null,
                2
            )}
            </code>
        </pre>
        <Table fixed celled selectable {...getTableProps()}>
            <Table.Header>
            {headerGroups.map(headerGroup => (
                <Table.Row {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <Table.HeaderCell sorted={column.isSorted ? column.isSortedDesc ? "descending" : "ascending" : null}  {...column.getHeaderProps()}>                        
                        {column.render('Header')}
                    </Table.HeaderCell>
                ))}
                </Table.Row>
            ))}
            </Table.Header>
            <Table.Body>
                {page.map(
                    (row, i) => 
                    prepareRow(row) || (
                        myRowFunc(row)
                    )
                )}
                {loading ? (
                // Use our custom loading state to show a loading indicator
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : null}
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan='3'>
                        <Menu floated='right' pagination>
                            <Menu.Item as='a' icon onClick={() => previousPage()} disabled={!canPreviousPage}> 
                                <Icon name='chevron left' />
                            </Menu.Item>
                            <Menu.Item as='a' icon onClick={() => nextPage()} disabled={!canNextPage}>
                                <Icon name='chevron right' />
                            </Menu.Item>
                        </Menu>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
        {/* 
            Pagination can be built however you'd like. 
            This is just a very basic UI implementation:
        */}
        <div className="pagination">
            <span>
            | Go to page:{' '}
            <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {                    
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
            />
            </span>{' '}
            <Dropdown
                button
                className='icon'
                floating
                labeled
                icon='world'
                options={[ { key: '3', text: '3', value: '3' },{ key: '5', text: '5', value: '5' }]}
                search
                text={`Show ${pageSize}`}
                value={pageSize}
                onChange={(e, { name, value }) => setPageSize(Number(value))}
            >
            </Dropdown>
        </div>
        </>
    )
}

const GridWrapper = (props) => {

  //const myData = React.useMemo(() => props.data, [])
  const {gridCols, onDataRecieved, initState, fetchMore, queryParams, rowCount} = props
  const state = initState//{ pageSize: 3,pageIndex:0, sortBy: [{ id: 'companyName', asc: true }] }
         
  let cols = []
  gridCols.forEach((v) => {    
    const {isFilter, filterType, isSortable, type, header, accessor} =  v      
    let c = {
      Header:header, 
      accessor
    }
    cols.push(c)
  })


  // We'll start our table without any data
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [pageCount, setPageCount] = React.useState(0)
  
  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Set the loading state
    setLoading(true)

    // We'll even set a delay to simulate a server here
    const startRow = pageSize * pageIndex
    const endRow = startRow + pageSize
    const pa = {...queryParams, pageIndex, pageSize}
    fetchMore(pa).then((nextData) => {
      let d =onDataRecieved(nextData)
      //d = d.slice(startRow, endRow)
      setData(d)    
    });
      

    // Your server could send back total page count.
    // For now we'll just fake it, too
    setPageCount(Math.ceil(rowCount / pageSize))
    console.log(`pageCount ${pageCount}`)
    setLoading(false)

  }, [])
  
  return (        
      <Grid gridCols={cols} 
            data ={data} 
            initialState={state}             
            fetchData={fetchData} 
            loading={loading}            
            pageCount={100}/>
  )
}
 

export {
    GridWrapper
}

