import React, { useState, useEffect, useMemo } from 'react';
import styled from "styled-components";
import "../../App.css"
import { Table, Icon, Label, Menu, Dropdown } from 'semantic-ui-react'
import {
  SelectColumnFilter,
  DefaultColumnFilter,
  EditableTextCell,
  EditableListCell,
  EditableCheckboxCell,
  EDIT_MODE,
  EDITMODE_METADATA} from './GridExtn'
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
  columns,
  gridColsMetaData,
  data,
  initialState,
  loading,
  pageCount: controlledPageCount,
  filterTypes,
  updateRow,
  disablePageResetOnDataChange,
  defaultColumn
}) => {

  //const tableState = useTableState(initialState)
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
      updateRow
    },
    useFilters,
    useSortBy,
    usePagination,
  )

  const myRowFunc = (row) => {
    return <Table.Row {...row.getRowProps()}>
      {row.cells.map((cell) => {

        if (cell.column.id !== EDIT_MODE) {
          const inEditState = /*cell.column.id !== EDIT_MODE &&*/ cell.row.cells[0].value !== true
          return (
            <Table.Cell {...cell.getCellProps()}>
              {
                !inEditState === false ? cell.render(() => {
                  return <span>{cell.value}</span>
                }) : cell.render('Cell')
              }
            </Table.Cell>
          )
        } else {
          //Handle edit action checkbox seperately
          const inEditState = cell.value === true
          const idx = cell.row.index
          const id = cell.column.id
          console.log(`checked ${cell.row.cells[2].value} .....  cell.Value ${cell.value} cell.Value === true ${cell.value === true}`)
          return <Table.Cell {...cell.getCellProps()}>
            {inEditState ?
              cell.render(
                () => {
                  return <input type="checkbox" checked onChange={(e) => {
                    e.preventDefault()
                    updateRow(idx, id, false)
                  }} />
                }) : cell.render(
                  () => {
                    return <input type="checkbox" onChange={(e) => {
                      e.preventDefault()
                      updateRow(idx, id, true)
                    }} />
                  })
            }
          </Table.Cell>

        }
      })}
    </Table.Row>
  }

  // Render the UI for your table
  return (
    <>
      {/* <pre>
        <code>{JSON.stringify(initialState, null, 2)}</code>
        </pre> */}
      <Table fixed celled selectable {...getTableProps()}>
        <Table.Header>
          {headerGroups.map(headerGroup => (
            <Table.Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {                
                return <Table.HeaderCell {...column.getHeaderProps()} >
                  {!column.columns && gridColsMetaData.get(column.id).isSortable === true ?
                    <div {...column.getSortByToggleProps()}>
                      <span>
                        {column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'}
                      </span>
                      {!column.columns ? column.render('Header') : ''}
                    </div>
                    : !column.columns ? column.render('Header') : ''
                  }
                  {column.columns ?
                    <div>
                      <Menu floated='right' pagination>
                        <Menu.Item as='a' icon onClick={() => previousPage()} disabled={!canPreviousPage}>
                          <Icon name='chevron left' />
                        </Menu.Item>
                        <Menu.Item as='a' icon onClick={() => nextPage()} disabled={!canNextPage}>
                          <Icon name='chevron right' />
                        </Menu.Item>
                      </Menu>
                    </div>
                    : ''}
                  {<div>{gridColsMetaData.get(column.id) && gridColsMetaData.get(column.id).isFilter ? column.render('Filter') : null}</div>}
                </Table.HeaderCell>
              })}
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
            <Table.HeaderCell colSpan={gridColsMetaData.size}>
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