import { Container, Form, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import NavProfileCard from './NavProfileCard'

const NavBar = () => {
  return (
    <header className="mb-5 pb-5">
      <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-body-tertiary border-bottom"
        fixed="top"
      >
        <Container fluid>
          <Link className="navbar-brand" to="/">
            <img src="/public/logo.png" alt="logo" height={30} />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto w-25">
              <Form className="flex-grow-1">
                <Form.Control placeholder="Search on MeeToo" />
              </Form>
            </Nav>
            <Nav>
              <NavProfileCard />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavBar
