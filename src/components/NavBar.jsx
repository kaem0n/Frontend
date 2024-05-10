/* eslint-disable react/prop-types */
import { Container, Form, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import NavProfileCard from './NavProfileCard'

const NavBar = ({ user }) => {
  return (
    <header>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-body-tertiary border-bottom"
        sticky="top"
      >
        <Container fluid>
          <Link className="navbar-brand" to="/">
            <img src="logo.png" alt="logo" height={30} />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto">
              <Form>
                <Form.Control placeholder="Search" />
              </Form>
            </Nav>
            <Nav>
              <NavProfileCard user={user} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavBar
