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

const EDIT_MODE = "editMode"
const EDITMODE_METADATA = () => {
  return {
    header: '',
    accessor: EDIT_MODE,
    isFilter:false,
    filterType:"",
    isSortable:false,
    type:"bool",
    editor:'EditableSelectionCell',
    show:true
  }
}

const Grid = ({
      columns, 
      gridColsMetaData,
      data, 
      initialState,        
      loading,
      pageCount:controlledPageCount,
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
    } =  useTable(
      {
        columns,
        data,
        state:initialState,
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

                    const inEditState = cell.column.id !== EDIT_MODE && cell.row.cells[0].value !== true
                    
                    return (
                        <Table.Cell {...cell.getCellProps()}>
                            {
                                 !inEditState === false ? cell.render(()=>{                                  
                                    return <span>{cell.value}</span>
                                }) : cell.render('Cell')
                            }                                                                    
                        </Table.Cell>
                    )
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
                    return  <Table.HeaderCell  {...column.getHeaderProps()}>                        
                              {/* <div {...column.getSortByToggleProps()}> */}
                                  {!column.columns ? column.render('Header'):
                                  <Menu floated='right' pagination>
                                      <Menu.Item as='a' icon onClick={() => previousPage()} disabled={!canPreviousPage}> 
                                          <Icon name='chevron left' />
                                      </Menu.Item>
                                      <Menu.Item as='a' icon onClick={() => nextPage()} disabled={!canNextPage}>
                                          <Icon name='chevron right' />
                                      </Menu.Item>
                                  </Menu>}
                                  {/* <span>
                                    {column.isSorted
                                      ? column.isSortedDesc
                                        ? ' 🔽'
                                        : ' 🔼'
                                      : ''}
                                  </span> */}
                                {/* </div> */}
                                {<div>{ gridColsMetaData.get(column.id) && gridColsMetaData.get(column.id).isFilter ? column.render('Filter') : null}</div>}
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
                    <Table.HeaderCell colSpan='3'></Table.HeaderCell>
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
} /*GRID CLASS ENDS */ 

const GridWrapper = (props) => {

  const {gridCols, onDataRecieved, initState, fetchMore, queryParams, rowCount} = props
  const state = initState//{ pageSize: 3,pageIndex:0, sortBy: [{ id: 'companyName', asc: true }] }
  
  //Setup State
  const tableState = useTableState(state)
  const [{ pageIndex, pageSize }] = tableState
    
  //A. Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(
    () => {
      fetchData({ pageIndex, pageSize })
    },
    [pageIndex, pageSize]
  )

  //Setup Grid Column metadata
  let cols = []
  gridCols.forEach((v) => {    
    const {isFilter, filterType, isSortable, type, header, accessor,editor, show} =  v      
    let c = {
      Header:header, 
      accessor
    }
   
    c.show = show

    switch(editor) {

      case "EditableListCell":
          c.Cell = EditableListCell        
          break;
      case "EditableTextCell":
          c.Cell = EditableTextCell          
          break;  
      case "EditableSelectionCell":
          c.Cell = EditableCheckboxCell
          break;  
      default:        
        break;        
    }

    if(isFilter){

      switch(filterType) {

        case "SelectColumnFilter":
          c.Filter = SelectColumnFilter
          c.filter = 'includes'
          break;
        case "DefaultColumnFilter":
            c.Filter = DefaultColumnFilter
            c.filter = 'includes'
            break;  
        case "containsFilter":
            c.filter = 'containsFilter'
            break;  
        default:
          c.canFilter = false; //Investigate
          c.disableFilters = true
          break;        
      }
    }
    cols.push(c)
  })

  //Now setup the Columns
  const gridColumns = React.useMemo(
    () => [
      {
        Header: ' ORDER ',
        columns: cols,
      }
    ],
    []
)   

const defaultReadOnlyColumn = React.useMemo(
  () => ({
    // Let's set up our default Filter UI
    Filter: DefaultColumnFilter,
    Cell: (row ) => {
      
    if(row.cell.id !== EDIT_MODE)      
      return <span>{row.cell.value}</span>
    }
  }),
  []
)

///////////////////////////////////////////////////

//Now setup the custom filters
const filterTypes = React.useMemo(
  () => ({
    // Add a new fuzzyTextFilterFn filter type.
    //fuzzyText: fuzzyTextFilterFn,
    // Or, override the default text filter to use
    // "startWith"
    containsFilter: (rows, id, filterValue) => {
      return rows.filter(row => {
        const rowValue = row.values[id]
        const found = rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .indexOf(String(filterValue).toLowerCase()) > -1
          : true

          return found
      })
    }
  }),
  []
)

/////////////////////////////DATA FETCHING / PAGING /////////////////////////////////
  // We'll start our table without any data
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [pageCount, setPageCount] = React.useState(0)
  const [masterData, setMasterData] = React.useState([]) //for r

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
        setMasterData(nextData)
        let d = onDataRecieved(nextData)
        //d = d.slice(startRow, endRow)
        setData(d)    
      });
        

      // Your server could send back total page count.
      // For now we'll just fake it, too
      setPageCount(Math.ceil(rowCount / pageSize))
      console.log(`pageCount ${pageCount}`)
      setLoading(false)
  }, [])
  
  /////////////////////////////DATA EDITING /////////////////////////////////
  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipPageResetRef = React.useRef(false)

  // When our cell renderer calls updateRow, we'll use
  // the rowIndex, columnID and new value to update the
  // original data
  const updateRow = (rowIndex, columnID, value) => {
    // We also turn on the flag to not reset the page
    console.log(`${rowIndex} ${columnID} ${value}`)
    skipPageResetRef.current = true
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {

          let obj = {
            ...old[rowIndex],
            [columnID]: value,
          }

          if(columnID !== EDIT_MODE)
            obj = {...obj, [EDIT_MODE]: false}
 
          return obj
        }
        return row
      })
    )
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    skipPageResetRef.current = false
  }, [data])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  //const resetData = () => setData(originalData)

  const GridStyles = styled.div`
    padding: 1rem;
    border: 1px red solid;
    height:30px;
  `
  return (      
      <Grid columns={gridColumns} 
            gridColsMetaData = {gridCols}
            defaultColumn={defaultReadOnlyColumn}
            data ={data} 
            initialState={tableState}             
            fetchData={fetchData} 
            loading={loading}            
            pageCount={rowCount}
            filterTypes={filterTypes}
            updateRow={updateRow}
            disablePageResetOnDataChange={skipPageResetRef.current}
      />    
  )
} /*GRIDWRAPPER CLASS ENDS */ 

/* ALL BELOW Functions OUTSIDE GRIDWRAPPER & GRID */

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val


// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {

  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        //performs exact match
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

/*************************EDITABLITY ****************************************/

// Create an editable cell renderer
const EditableTextCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  updateRow, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateRow(index, id, value)
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

// Create an editable cell renderer
const EditableListCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  data: { data },
  updateRow, // This is a custom function that we supplied to our table instance
}) => {

  data = [{key:'Federal Shipping', value:'Federal Shipping'},
          {key:'Speedy Express', value:'Speedy Express'},
          {key:'United Package', value:'United Package'}
        ]
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateRow(index, id, value)
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <select
            value={value}
            onChange={onChange} onBlur={onBlur}
          >
            {data.map(v => (
              <option key={v.key} value={v.value}>
                 {v.value}
              </option>
            ))}
          </select>
}

const EditableCheckboxCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  updateRow // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(false)

  const onChange = e => {
    e.stopPropagation()
    updateRow(index, id, e.target.checked)
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input type="checkbox" onChange={onChange} />
}

/* ALL ABOVE Functions OUTSIDE GRIDWRAPPER & GRID */

export {
    GridWrapper,
    EDIT_MODE,
    EDITMODE_METADATA
}

