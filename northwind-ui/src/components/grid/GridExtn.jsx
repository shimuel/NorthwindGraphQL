import React from 'react';
import "../../App.css"
import {Container, Icon, Grid, GridColumn} from 'semantic-ui-react'
import styled from "styled-components";
import "../../App.css"
import matchSorter from 'match-sorter'

/* ALL BELOW Functions OUTSIDE GRIDWRAPPER & GRID */
const EDIT_MODE = "editMode"

const EDITMODE_METADATA = () => {
  return {
    header: '',
    accessor: EDIT_MODE,
    isFilter: false,
    minWidth: 50,
    filterType: "",
    isSortable: false,
    type: "bool",
    editor: 'HiddenCell',
    show: true
  }
}

const fuzzyTextFilterFn = (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  
  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val
  
  
  // Define a default UI for filtering
const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
  }) => {
  
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
  const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
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
  const HiddenCell = ({
    cell: { value: initialValue },
    row: { index },
    column: { id },
    updateRow, // This is a custom function that we supplied to our table instance
    addRow,
    newGridIdItem,      
    setEditMode,
    deleteRow,
    rollbackChanges

  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onSave = e => {
      console.log('Saving...')
      updateRow(index, EDIT_MODE, false)
    }
    
    const onCancel = e => {      
      console.log('Cancelled...')
      setEditMode(-1, EDIT_MODE, false)
    }

    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return <Container><Grid>
        <GridColumn>
          <Icon className='x icon' onClick={onCancel}></Icon>
        </GridColumn>
        <GridColumn>
          <Icon className='save icon' onClick={onSave}></Icon>
        </GridColumn>
    </Grid></Container>
  }


  // Create an editable cell renderer
  const EditableTextCell = ({
    cell: { value: initialValue },
    row: { index },
    column: { id },
    updateRow, // This is a custom function that we supplied to our table instance
    addRow,
    newGridIdItem,      
    setEditMode,
    deleteRow,
    rollbackChanges
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      console.log(`Update...${index}, ${id}, ${value}`)
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
    addRow,
    newGridIdItem,      
    setEditMode,
    deleteRow,
    rollbackChanges
  }) => {
  
    data = [{ key: 'Federal Shipping', value: 'Federal Shipping' },
    { key: 'Speedy Express', value: 'Speedy Express' },
    { key: 'United Package', value: 'United Package' }
    ]
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      console.log(`Update...${index}, ${id}, ${value}`)
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
    updateRow, // This is a custom function that we supplied to our table instance
    addRow,
    newGridIdItem,      
    setEditMode,
    deleteRow,
    rollbackChanges
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState()
  
    const onChange = e => {
      e.stopPropagation()
      console.log(`Update...${index}, ${id}, ${e.target.checked}`)
      updateRow(index, id, e.target.checked)
    }
  
    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return <input type="checkbox" onChange={onChange} />
  }
  
  export {  
    HiddenCell,  
    SelectColumnFilter,
    DefaultColumnFilter,
    EditableTextCell,
    EditableListCell,
    EditableCheckboxCell,
    EDIT_MODE,
    EDITMODE_METADATA
  }

