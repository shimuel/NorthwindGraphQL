import React from 'react';
import styled from "styled-components";
// import {Container, Icon, Grid as semGrid, GridColumn} from 'semantic-ui-react'
import "../../App.css"
import {
  useTableState
} from 'react-table'
import {Grid} from './Grid'  
import {
  HiddenCell,
  SelectColumnFilter,
  DefaultColumnFilter,
  EditableTextCell,
  EditableListCell,
  EditableCheckboxCell,
  EDIT_MODE} from './GridExtn'

const GridWrapper = (props) => {

  const { gridCols, onDataRecieved, initState, fetchMore, queryParams, rowCount, newItemCallback } = props
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
    const { isFilter, filterType, isSortable, type, header, accessor, editor, show } = v
    let c = {
      Header: header,
      accessor
    }

    c.show = show

    if (isSortable) {
      c.isSorted = true
      c.isSortedDesc = true
    } else {
      c.isSorted = false
      c.isSortedDesc = false
    }
    switch (editor) {

      case "EditableListCell":
        c.Cell = EditableListCell
        break;
      case "EditableTextCell":
        c.Cell = EditableTextCell
        break;
      case "EditableSelectionCell":
        c.Cell = EditableCheckboxCell
        break;
      case "HiddenCell":
        c.Cell = HiddenCell
        break;
      default:
        break;
    }

    if (isFilter) {

      switch (filterType) {

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
      // Cell: (row) => {

      //   //if (row.cell.id !== EDIT_MODE)
      //     return <span>{row.cell.value}</span>
      // }
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
              .startsWith(String(filterValue).toLowerCase())
            //.indexOf(String(filterValue).toLowerCase()) > -1
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
    const pa = { ...queryParams, pageIndex, pageSize }
    fetchMore(pa).then((nextData) => {      
      let d = onDataRecieved(nextData)
      // d = d.slice(startRow, endRow)      
      d = d.slice(0, 3)
      d =  d.map(i => {        
        return {...i, [EDIT_MODE]: false}
      })
      setData(d)
      setMasterData(d)
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

    // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const rollbackChanges = () => {
    setData(masterData)
  }

  const setEditMode = (rowIndex, columnID) => {

    setData(old =>
      old.map((row, index) => {
        
        //console.log(`before...${JSON.stringify(row)}`)
        let o = {
          ...old[index],
          [columnID]: index === rowIndex ? true:false,
        }
        //console.log(`before...${JSON.stringify(row)}`)
        return o
      })
    );   
  }

  const addRow = () => {              
        //turn of other edits
        skipPageResetRef.current = true
        setEditMode(-1, EDIT_MODE)                        
        setData(oldItems => [...oldItems, {...newItemCallback(), [EDIT_MODE]: true}]);   
  }

  const deleteRow = (rowIndex) => {

  }

  // When our cell renderer calls updateRow, we'll use
  // the rowIndex, columnID and new value to update the
  // original data
  const updateRow = (rowIndex, columnID, value) => {
    // We also turn on the flag to not reset the page
    //console.log(`${rowIndex} ${columnID} ${value}`)
    
    skipPageResetRef.current = true
    
    if(EDIT_MODE === columnID){      
      setEditMode(rowIndex, columnID)
    } else {      
      setData(old =>
        old.map((row, index) => {
          if (index === rowIndex) {
            let obj = {
              ...old[rowIndex],
              [columnID]: value,
            }
            return obj
          }
          return row
        })
      )
    }    
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
      gridColsMetaData={gridCols}
      defaultColumn={defaultReadOnlyColumn}
      data={data}
      initialState={tableState}
      fetchData={fetchData}
      loading={loading}
      pageCount={rowCount}
      filterTypes={filterTypes}
      updateRow={updateRow}
      addRow={addRow}
      newGridIdItem={newItemCallback}
      setEditMode={setEditMode}
      deleteRow={deleteRow}
      rollbackChanges={rollbackChanges}
      disablePageResetOnDataChange={skipPageResetRef.current}
    />
  )
} /*GRIDWRAPPER CLASS ENDS */
export{
  GridWrapper
}