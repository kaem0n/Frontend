import { useEffect, useState } from 'react'
import { Container, Form, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import NavProfileCard from './NavProfileCard'

const NavBar = () => {
  const accessToken = localStorage.getItem('accessToken')
  const [user, setUser] = useState(null)

  const getUserData = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/users/me', {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        const userData = {
          id: data.id,
          boardId: data.board.id,
          username: data.username,
          email: data.email,
          proPic: data.proPicUrl,
          registration: data.registration,
          name: data.name,
          surname: data.surname,
          birthday: data.birthday,
          gender: data.gender,
          occupation: data.occupation,
          hobbies: data.hobbies,
          bio: data.bio,
        }
        setUser(userData)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user === null) {
      getUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <Nav className="me-auto">
              <Form>
                <Form.Control placeholder="Search" />
              </Form>
            </Nav>
            <Nav>
              <Nav.Link href="#">???</Nav.Link>
              <NavProfileCard user={user} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default NavBar
