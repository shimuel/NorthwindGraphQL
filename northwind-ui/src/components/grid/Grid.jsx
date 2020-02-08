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

const Grid = ({
  isGridEditabe,
  columns,
  gridColsMetaData,
  data,
  initialState,
  loading,
  pageCount: controlledPageCount,
  filterTypes,  
  disablePageResetOnDataChange,
  defaultColumn,
  updateRow,
  addRow,
  newGridIdItem,
  setEditMode,
  deleteRow,
  rollbackChanges
}) => {

  const [{ pageIndex, pageSize }] = initialState

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
  } = useTable(
    {
      columns,
      data,
      state: initialState,
      defaultColumn, //// Let's set up our default Filter UI
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      filterTypes,
      pageCount: controlledPageCount,
      disablePageResetOnDataChange,
      updateRow,
      addRow,
      newGridIdItem,      
      setEditMode,
      deleteRow,
      rollbackChanges
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  )

  const onSelectRow = (row) => {
    return <Table.Row {...row.getRowProps()}>
      {row.cells.map((cell) => {        
        //console.log(`EDIT_MODE ${EDIT_MODE} ${cell.row.original.editMode} ${cell.value}`)
        //if (cell.column.id !== EDIT_MODE) {
          const inEditState = cell.row.original.editMode === true 
          return (
            <Table.Cell {...cell.getCellProps()} onClick={(e) => {                     
              const idx = cell.row.index
              const id = EDIT_MODE       
              e.preventDefault()                              
              if(!inEditState) {           
                // console.log(`Going into edit mode..`)
                updateRow(idx, 'editMode', true)                
              }
            }}>
              {                
                !inEditState ? cell.render(() => {

                  return <span>{cell.value}</span>
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
      
    if(!column.columns /*! the Group Header Column*/ ) {
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
    if(column.columns ) {
        if(isGridEitable) {
            return <div>                                        
                    <Button floated='left' className='ui primary button' onClick={() => {                                                                 
                          addRow()                                                    
                      }                      
                    }> Add</Button>   
                    <Button floated='left' className='ui primary button' onClick={() => {  
                          setEditMode(-1, EDIT_MODE)                                                      
                          rollbackChanges()                             
                      }                      
                    }> Rollback</Button>     
                    {column.render('Header') }                                         
                  </div>
        }
        else
        return column.render('Header')      
    } else return null
  }

  const renderScrollingButtons = () => {
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
      { /*<pre>
        <code>{JSON.stringify(initialState, null, 2)}</code>
      </pre> */}
      <Table fixed celled selectable {...getTableProps()}>
        <Table.Header>
          {headerGroups.map(headerGroup => (
            <Table.Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {                
                return <Table.HeaderCell {...column.getHeaderProps()} >
                  {renderHeaderSortIndicators(column)}
                  {renderHeaderAddRollbackButtons(column, isGridEditabe) }
                  {column.columns ? renderScrollingButtons() : ''}
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
              {renderScrollingButtons()}
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
          options={[{ key: '3', text: '3', value: '3' }, { key: '5', text: '5', value: '5' }]}
          search
          text={`Show ${pageSize}`}
          value={pageSize}
          onChange={(e, { name, value }) => setPageSize(Number(value))}
        >
        </Dropdown>
      </div>
    </>
  )
} /*GRID CLASS ENDS */


/* ALL ABOVE Functions OUTSIDE GRIDWRAPPER & GRID */

export{
  Grid
}