import React, { useState, useEffect, useMemo } from 'react';
import styled from "styled-components";
import "../../App.css"
import { Table, Icon, Label, Menu, Dropdown, Button } from 'semantic-ui-react'
import  { EDIT_MODE } from './GridExtn'
import {
  useTable,
  //useGroupBy,
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

const Styles = styled.div`
  /* This is required to make the table full-width */
    display: block;
    max-width: 100%;

    /* This will make the table scrollable when it gets too small */
    .tableWrap {
      display: block;
      max-width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      border-bottom: 1px solid black;
    }

    table {
      /* Make sure the inner table is always as wide as needed */
      width: 100%;
      border-spacing: 0;

      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      th,
      td {
        margin: 0;
        padding: 0.5rem;
        /*border-bottom: 1px solid black;*/
        /*border-right: 1px solid black;*/

        /* The secret sauce */
        /* Each cell should grow equally */
        width: 1%;
        /* But "collapsed" cells should be as small as possible */
        &.collapse {
          width: 0.0000000001%;
        }

        :last-child {
          border-right: 0;
        }
      }
    }

    .pagination {
      padding: 0.5rem;
    }
`
  const Grid = ({
  isGridEditabe,
  columns,
  gridColsMetaData,
  data,
  initialState,
  loading,
  fetchData,
  pageCount: controlledPageCount,
  filterTypes,  
  disablePageResetOnDataChange,
  defaultColumn,
  updateRow,
  addRow,
  newGridIdItem,
  setEditMode,
  deleteRow,
  revertChanges,
  onRowClick,
  onCellClick
}) => {
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
    // Get the state from the instance
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, //// Let's set up our default Filter UI
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      filterTypes,
      initialState:initialState,
      pageCount: controlledPageCount,
      disablePageResetOnDataChange,
      updateRow,
      addRow,
      newGridIdItem,      
      setEditMode,
      deleteRow,
      revertChanges,
      onRowClick,
      onCellClick
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  )


  //A. Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(
    () => {
      fetchData({ pageIndex, pageSize })
    },
    [pageIndex, pageSize]
  )

  const onSelectRow = (row) => {
   
    return <Table.Row { ...row.getRowProps( onRowClick ? {onClick: () =>{ 
      const {editMode, ...noA } = row.original
        onRowClick({...noA}, row.index)
      }}:'')}>
      {row.cells.map((cell) => {        
    
          const inEditState = cell.row.original.editMode === true 
          return (
            <Table.Cell {...cell.getCellProps()} onClick={(e) => {  
              const idx = cell.row.index
              const id = EDIT_MODE       
              e.preventDefault()                              
              if(!inEditState) {           
                // console.log(`Going into edit mode..`)
                updateRow(idx, 'editMode')                
              }
              if(onCellClick){
                const {editMode, ...noA} = cell.row.original
                noA.row = cell.row.index
                noA.col = cell.column.index
                onCellClick(noA)
              }
            }}>
              {                
                !inEditState ? cell.render(() => {

                  return cell.value ? <span>{cell.value.toString()}</span> : <span>{cell.value}</span> 
                }) : cell.render('Cell')
              }
            </Table.Cell>
          )
      })}
    </Table.Row>
  }

  const renderHeaderFilters = (column) => {
    if(gridColsMetaData.get(column.id) && gridColsMetaData.get(column.id).isFilter )
      return column.render('Filter')
    else
      return null
  }
  const renderHeaderSortIndicators = (column) => {
      
    if(column && !column.columns /*! the Group Header Column*/ ) {
      if(gridColsMetaData.get(column.id).isSortable === true ) {
        return <div {...column.getSortByToggleProps()}>
          <span>
            {column.isSortedDesc
              ? ' 🔽'
              : ' 🔼'
            }
          </span>
          {column.render('Header')}
        </div>
      } else 
          return column.render('Header')
    }
    return null
  }

  const renderHeaderAddRollbackButtons = (column, isGridEitable) => {
    /*the Group Header Column*/ 
    if(column && column.columns ) {
        if(isGridEitable) {
            return <div className='ui pagination left floated menu'>
                    <Button className='ui primary button' onClick={() => {                                                                 
                                addRow()                                                    
                            }                      
                          }> Add</Button>  
                    <Button floated='left' className='ui primary button' onClick={() => {  
                                //setEditMode(-1, EDIT_MODE)                                                      
                                revertChanges()                             
                            }                      
                          }> Rollback</Button>     
                  </div>                       
        }
        else
          return column.render('Header')      
    } else return null
  }

  const renderPagination = () =>{
    return <Menu floated='right' pagination>
      <Menu.Item as='a' icon onClick={() => previousPage()} disabled={!canPreviousPage}>
        <Icon name='chevron left' />
      </Menu.Item>
      <Menu.Item as='a' icon onClick={() => nextPage()} disabled={!canNextPage}>
        <Icon name='chevron right' />
      </Menu.Item>
    </Menu>
  }
  // Render the UI for your table
  return (
    <>
      <Styles>
        <Table fixed celled selectable {...getTableProps()}>
          <Table.Header>
            {headerGroups.map(headerGroup => (
              <Table.Row {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {                
                  return <Table.HeaderCell {...column.getHeaderProps()} >
                    {column && column.columns ? renderHeaderAddRollbackButtons(column, isGridEditabe) :null }
                    {column && column.columns ? renderPagination() :null }
                    {renderHeaderSortIndicators(column)}                    
                    <div>{renderHeaderFilters(column)}</div>
                  </Table.HeaderCell>
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {page.map((row, i) => {
              prepareRow(row)
                return  onSelectRow(row)
              }
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
              <Table.HeaderCell colSpan={gridColsMetaData.size}>
              {renderPagination()}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Styles>
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
          options={[{ key: '3', text: '3', value: '3' }, { key: '5', text: '5', value: '5' }]}
          search
          text={`Show ${initialState.pageSize}`}
          value={initialState.pageSize}
          onChange={(e, { name, value }) => { 
            setPageSize(Number(value))}
          }
        >
        </Dropdown>
      </div>
      { <pre>
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
      </pre>}
    </>
    
  )

  
} /*GRID CLASS ENDS */


/* ALL ABOVE Functions OUTSIDE GRIDWRAPPER & GRID */

export{
  Grid
}