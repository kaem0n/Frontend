import { Container, Form, Nav, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import NavProfileCard from './NavProfileCard'
import { useState } from 'react'

const NavBar = () => {
  const accessToken = localStorage.getItem('accessToken')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const navigate = useNavigate()

  const getSearchResults = async (query) => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/search?query=${query}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const result = await res.json()
        console.log(result)
        setSearchResults(result)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    search !== '' && navigate(`/search?query=${search}`)
    setSearch('')
  }

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
              <Form
                className="flex-grow-1 position-relative"
                onSubmit={handleSubmit}
              >
                <Form.Control
                  placeholder="Search on MeeToo"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    getSearchResults(e.target.value)
                  }}
                />
                {searchResults && search !== '' && (
                  <div className="bg-body-secondary rounded-bottom-2 position-absolute top-100 pb-2 pt-3 px-3 w-100">
                    {searchResults.users.length > 0 &&
                      searchResults.users
                        .filter((el, i) => i < 2)
                        .map((el) => (
                          <div
                            key={el.id}
                            className="d-flex align-items-center mb-2"
                          >
                            <i className="fa-solid fa-magnifying-glass me-3"></i>
                            <div>
                              <Link
                                to={`/profile/${el.id}`}
                                className="link-body-emphasis"
                                onClick={() => setSearch('')}
                              >
                                {el.username}
                              </Link>
                              <p className="text-secondary fs-8 lh-1">User</p>
                            </div>
                          </div>
                        ))}
                    {searchResults.groups.length > 0 &&
                      searchResults.groups
                        .filter((el, i) => i < 2)
                        .map((el) => (
                          <div
                            key={el.id}
                            className="d-flex align-items-center mb-2"
                          >
                            <i className="fa-solid fa-magnifying-glass me-3"></i>
                            <div>
                              <Link
                                to={`/group/${el.id}`}
                                className="link-body-emphasis"
                                onClick={() => setSearch('')}
                              >
                                {el.name}
                              </Link>
                              <p className="text-secondary fs-8 lh-1">Group</p>
                            </div>
                          </div>
                        ))}
                    {(searchResults.posts.length > 0 ||
                      searchResults.comments.length > 0) && (
                      <div className="d-flex align-items-center mb-2">
                        <i className="fa-solid fa-magnifying-glass me-3"></i>
                        <div>
                          <p>#{search}</p>
                          <p className="text-secondary fs-8 lh-1">
                            {searchResults.posts.length +
                              searchResults.comments.length}{' '}
                            posts and comments found
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-center menu-option">
                      <button
                        className="btn-clean flex-grow-1"
                        onClick={() => {
                          search !== '' && navigate(`/search?query=${search}`)
                          setSearch('')
                        }}
                      >
                        <i className="fa-solid fa-ellipsis"></i>
                      </button>
                    </div>
                  </div>
                )}
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
