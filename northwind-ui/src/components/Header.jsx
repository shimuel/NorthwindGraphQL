import React,{Component} from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem, FormControl, Navbar, NavDropdown, Button, Nav, Form } from 'react-bootstrap';
//import { LinkContainer } from "react-router-bootstrap";
import "../App.css"
const  Header = () => {         
  return (     
<>
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand style={{cursor: "none"}}>Navbar</Navbar.Brand>
    <Nav className="mr-auto">
      <ul className="list-inline" style={{margin:"10px"}}>
        <li className="list-inline-item"><NavLink className="NavLink" to="/">Home</NavLink></li>
        <li className="list-inline-item"><NavLink className="NavLink"  to="/first">Features</NavLink></li>
        <li className="list-inline-item"><NavLink className="NavLink"  to="/second">Price</NavLink></li>
        <li className="list-inline-item"><NavLink className="NavLink" to="/third">About</NavLink></li>
        <li className="list-inline-item">
          <NavDropdown title="Dropdown" className="NavDropdown" id="basic-nav-dropdown">
            <NavDropdown.Item><NavLink className="NavLink" to="/">Action</NavLink></NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </li>
      </ul>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-info">Search</Button>
    </Form>
  </Navbar>
</>
  )  
}

export default Header
