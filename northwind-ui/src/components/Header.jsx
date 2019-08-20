import React,{Component} from 'react'
import { NavLink, Link } from 'react-router-dom'
import { NavItem, FormControl, Navbar, NavDropdown, Button, Nav, Form } from 'react-bootstrap';
//import { LinkContainer } from "react-router-bootstrap";
import "../App.css"
const  Header = () => {         
  return (     
    <>
      <Navbar collapseOnSelect  expand="lg">
        <Navbar.Brand style={{cursor: "none"}}>Navbar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link className="NavLink" eventKey="1" as={Link} to="/">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link className="NavLink" eventKey="2" as={Link} to="/first">
                Features
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="NavLink" eventKey="3" as={Link} to="/second">
                Prices
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="NavLink"  eventKey="3" as={Link} to="/third">
                Other
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <NavDropdown title="Dropdown" className="NavDropdown" id="basic-nav-dropdown">
              <NavDropdown.Item><NavLink className="NavLink" to="/">Action</NavLink></NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
            </Nav.Item>
          </Nav>
          <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  )  
}

export default Header
{/* <Nav className="mr-auto d-block"> vertical nav items*/}