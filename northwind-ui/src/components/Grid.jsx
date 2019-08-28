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
import matchSorter from 'match-sorter'

const GridWrapper = (props) => {

    const columns = React.useMemo(
        () => props.columns,
        []
    )

    //setting filters
    let col = columns[0].columns[2];
        col.Filter = SelectColumnFilter
        col.filter =  'includes'
        
    // Other Filter Types available
    //   Filter: SliderColumnFilter,
    //   filter: 'equals',

    //   Filter: NumberRangeColumnFilter,
    //   filter: 'between',

    //   Filter: SelectColumnFilter,
    //   filter: 'includes',

    //   Filter: SliderColumnFilter,
    //   filter: filterGreaterThan,

    const myData = React.useMemo(() => props.data, [])
    const initialState = { pageSize: props.pageSize, pageIndex:0, sortBy: [{ id: props.initialSortColumn, asc: true }] }

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
        <Grid columns={columns} data={myData} state={mystate}/>
    )
}

//Tyes of FIlters
// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
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
    let dropObjs = []
    const options = React.useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        dropObjs.push({ key: row.values[id], text: row.values[id], value: row.values[id] })  
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
        //Need investigate
        // <Dropdown
        //     options={dropObjs}
        //     value={filterValue}
        //     onChange={e => {
        //     setFilter(e.target.value || undefined)
        //     }}
        // />
    )
  }

  // This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the min and max
    // using the preFilteredRows
  
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      preFilteredRows.forEach(row => {
        min = Math.min(row.values[id], min)
        max = Math.max(row.values[id], max)
      })
      return [min, max]
    }, [id, preFilteredRows])
  
    return (
      <>
        <input
          type="range"
          min={min}
          max={max}
          value={filterValue || min}
          onChange={e => {
            setFilter(parseInt(e.target.value, 10))
          }}
        />
        <button onClick={() => setFilter(undefined)}>Off</button>
      </>
    )
  }
  
  // This is a custom UI for our 'between' or number range
  // filter. It uses two number boxes and filters rows to
  // ones that have values between the two
  function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
  }) {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      preFilteredRows.forEach(row => {
        min = Math.min(row.values[id], min)
        max = Math.max(row.values[id], max)
      })
      return [min, max]
    }, [id, preFilteredRows])
  
    return (
      <div
        style={{
          display: 'flex',
        }}
      >
        <input
          value={filterValue[0] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value
            setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <input
          value={filterValue[1] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value
            setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
    )
  }
  
function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
  
  // Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue >= filterValue
    })
  }
  
  // This is an autoRemove method on the filter function that
  // when given the new filter value and returns true, the filter
  // will be automatically removed. Normally this is just an undefined
  // check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

/////////////////////////////////////////////////

const Grid = ({ columns, data }) => {

    const filterTypes = React.useMemo(
        () => ({
          // Add a new fuzzyTextFilterFn filter type.
          fuzzyText: fuzzyTextFilterFn,
          // Or, override the default text filter to use
          // "startWith"
          text: (rows, id, filterValue) => {
            return rows.filter(row => {
              const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true
            })
          },
        }),
        []
    )
    
    const defaultColumn = React.useMemo(
        () => ({
          // Let's set up our default Filter UI
          Filter: DefaultColumnFilter,
        }),
        []
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
        state: [{ pageIndex, pageSize }],
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage,
        toggleSortBy
    } = useTable( 
        {   //// Use the useTable hook to create your table configuration        
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes,
        },
        useFilters, // useFilters!
        useFilters,
        useSortBy,
        useExpanded,
        usePagination,
        useTableState,
        useRowSelect,
        useRowState
    )    

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
                        <div>{column.canFilter ? column.render('Filter') : null}</div>
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
    GridWrapper
}


