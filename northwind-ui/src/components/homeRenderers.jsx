import React from "react";
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
    useTableState,
    useEffect,
    useMemo

  } from 'react-table'

const RenderOrders = (data) => {

    const columns = React.useMemo(
        () => [
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
        ],
        []
      )
      const myData = React.useMemo(() => data.orders.allOrds, [])
      const initialState = { pageSize: 3,pageIndex:0, sortBy: [{ id: 'companyName', asc: true }] }

      // Here, we can override the pageIndex
      // regardless of the internal table state
    //   const overrides = React.useMemo(() => ({
    //     pageIndex: 1,
    //   }))
    
      const mystate = useTableState(initialState)
    
      // You can use effects to observe changes to the state
    //   React.useEffect(() => {
    //     console.log('Page Size Changed!', initialState.pageSize)
    //   }, [initialState.pageSize])
      return (        
          <MyTable columns={columns} data={myData} state={mystate}/>
      )
}

/////////////////////////////////////////////////

const MyTable = (props) => {

    // Use the useTable hook to create your table configuration
    const instance = useTable(
        props,
        useGroupBy,
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useTableState,
        // useRowSelect,
        // useRowState
    )    
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        headerGroups,
        rows,
        getRowProps,
        prepareRow,
        pageOptions,
        pageCount,
        page,
        // pageSize,
        // pageIndex,    
        state: [{ pageIndex, pageSize,  groupBy }],
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage,
        toggleSortBy
    } = instance

    const myRowFunc = (row) => {
        console.log(`Rows Path ${row.path}`)
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

    const myCellFunc = (obj) => {
        //console.log(`Rows Path ${JSON.stringify(cell)}`)
        return <input value={obj.cell.value} onChange={(v)=> {v.preventDefault(); console.log(v.target.value)}}/>
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
        <Table fixed sortable celled selectable {...getTableProps()}>
            <Table.Header>
            {headerGroups.map(headerGroup => (
                <Table.Row {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <Table.HeaderCell sorted={column.isSorted ? column.isSortedDesc ? "descending" : "ascending" : null}  {...column.getHeaderProps(column.getSortByToggleProps())}>                        
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
                    debugger
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

export {
    RenderOrders
}


