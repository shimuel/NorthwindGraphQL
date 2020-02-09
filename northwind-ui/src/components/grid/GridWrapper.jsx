import React from 'react';
import styled from "styled-components";
// import {Container, Icon, Grid as semGrid, GridColumn} from 'semantic-ui-react'
import "../../App.css"
import {Grid} from './Grid'  
import {
  HiddenCell,
  SelectColumnFilter,
  DefaultColumnFilter,
  EditableTextCell,
  EditableListCell,
  EditableCheckboxCell,
  EDIT_MODE,
  ACTION_SAVED,
  ACTION_CANCELLED,
  EDITMODE_METADATA} from './GridExtn'
  

const GridWrapper = (props) => {

  const { gridHeader, gridCols, onDataRecieved, initState, fetchMore, fetchPageCount, queryParams, onNewRowCallback, cellClickCallBack, rowClickCallback } = props
  let { isGridEditabe } = props

  isGridEditabe = isGridEditabe  || false
  //Setup Grid Column metadata
  let cols = []
  gridCols.forEach((cObj) => {
    const { isFilter, filterType, isSortable, header, accessor, editor, show } = cObj
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

    if(isGridEditabe) {
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

  if(isGridEditabe)
    gridCols.set(EDIT_MODE,EDITMODE_METADATA())

  //Now setup the Columns
  const gridColumns = React.useMemo(
    () => [
      {
        Header: gridHeader,
        columns: cols,
      }
    ],
    []
  )

  const defaultReadOnlyColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
        // When using the useFlexLayout:
        minWidth: 30, // minWidth is only used as a limit for resizing
        width: 150, // width is used for both the flex-basis and flex-grow
        maxWidth: 200, // maxWidth is only used as a limit for resizing
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
    // const startRow = pageSize * pageIndex
    // const endRow = startRow + pageSize
    const pa = { ...queryParams, pageIndex, pageSize }

    fetchMore(pa).then((nextData) => {   
      
      setPageCount(fetchPageCount(nextData.data))
      let d = onDataRecieved(nextData)
      d = d.slice(0, pageSize)
      d =  d.map(i => {        
        return {...i, [EDIT_MODE]: false}
      })
      setData(d)
      setMasterData(d)

      console.log(`pageCount ${pageCount}`)
    });


    // Your server could send back total page count.
    // For now we'll just fake it, too
    //setPageCount(Math.ceil(rowCount / pageSize))

    setLoading(false)
  }, [])

  /////////////////////////////DATA EDITING /////////////////////////////////
  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipPageResetRef = React.useRef(false)

    // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const revertChanges = () => {
    //setData(masterData)
    if(masterData.length !== data.length)
    {

    }else{
      
    }
  }

  //Turn on edit mode for all cells in the row to be edited and turn off edit in other rows
  const setEditMode = (rowIndex, columnID, value) => {
    
    setData(old =>
      old.map((row, index) => {        
        //console.log(`\nsetEditMode before...${JSON.stringify(old[index],)}`)
        const  o = {
            ...old[index],
            [columnID]: index === rowIndex ? true: false
          }
        //console.log(`\nsetEditMode after...${JSON.stringify(o)}`)
        return o
      })
    );   
  }

  const cancelEditMode = () => {
    
    setData(old =>
      old.map((row, index) => {        
        //console.log(`\nsetEditMode before...${JSON.stringify(old[index],)}`)
        const  o = {
            ...old[index],
            [EDIT_MODE]: false
          }
        //console.log(`\nsetEditMode after...${JSON.stringify(o)}`)
        return o
      })
    );   
  }

  const onAdd = () => {              
        //turn of other edits
        skipPageResetRef.current = true    
        cancelEditMode()   
        setData(oldItems => {
          return [...oldItems, {...onNewRowCallback(), [EDIT_MODE]: true}]
        });       
  }

  const onDelete = (rowIndex) => {

  }

  // This method is called 
  //1. to turnOn the edit state
  //2. focus shifts from 1 cell to another cell in the editig row
  //3. when focus shifts out of the editing row to another row
  // turns on Edit mode and ALSO to update any changes done 
  // When our cell renderer calls updateRow, we'll use
  // the rowIndex, columnID and new value to update the
  // original data with the new value
  const onUpdate = (rowIndex, columnID, value) => {
    // We also turn on the flag to not reset the page
    //console.log(`${rowIndex} ${columnID} ${value}`)
    skipPageResetRef.current = true
    
    if(EDIT_MODE === columnID) {   
      // console.log(`\nonUpdate....Going into EditMode..rowIdx ${rowIndex} columnID ${columnID} value ${JSON.stringify(value)}`)
      if(value && (value === ACTION_SAVED || value === ACTION_CANCELLED )) {
          cancelEditMode()
          if(value === ACTION_SAVED)
            console.log('saved !')    
          else
            console.log('cancelled !')        
      } else {
          setEditMode(rowIndex, columnID)
      }

    } else {      
      setData(old =>
        old.map((row, index) => {
          if (index === rowIndex) {
            // console.log(`\nonUpdate....before...${JSON.stringify(row)}`)
            let obj = {
              ...old[rowIndex],
              [columnID]: value,
            }
            // console.log(`\nonUpdate....after...${JSON.stringify(row)}`)
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
    <Grid 
      isGridEditabe={isGridEditabe}
      columns={gridColumns}
      gridColsMetaData={gridCols}
      defaultColumn={defaultReadOnlyColumn}onCellClick
      data={data}
      initialState={initState}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
      filterTypes={filterTypes}      
      addRow={onAdd}
      updateRow={onUpdate}
      deleteRow={onDelete}
      onRowClick={rowClickCallback}
      onCellClick={cellClickCallBack}
      setEditMode={setEditMode}
      revertChanges={revertChanges}
      disablePageResetOnDataChange={skipPageResetRef.current}
    />
  )
} /*GRIDWRAPPER CLASS ENDS */
export{
  GridWrapper
}