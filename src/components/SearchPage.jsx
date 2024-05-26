import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProfileGroupCard from './group/ProfileGroupCard'
import Post from './Post'

const SearchPage = () => {
  const accessToken = localStorage.getItem('accessToken')
  const [searchResults, setSearchResults] = useState(null)
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [showAllGroups, setShowAllGroups] = useState(false)
  const [showAllPosts, setShowAllPosts] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:3030/api/search${location.search}`,
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

    getSearchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    searchResults && (
      <Container fluid="md" className="mb-5">
        <Row className="justify-content-center gy-5">
          {searchResults.groups.length > 0 &&
            !showAllUsers &&
            !showAllPosts && (
              <Col lg={8}>
                <Card className="bg-body-tertiary">
                  <Card.Body>
                    <h4 className="mb-3">Groups</h4>
                    <Container fluid>
                      <Row xs={2} sm={3} lg={3} xl={4} className="g-3">
                        {showAllGroups
                          ? searchResults.groups.map((el) => (
                              <Col key={el.id}>
                                <ProfileGroupCard data={el} />
                              </Col>
                            ))
                          : searchResults.groups
                              .filter((el, i) => i < 3)
                              .map((el) => (
                                <Col key={el.id}>
                                  <ProfileGroupCard data={el} />
                                </Col>
                              ))}
                      </Row>
                    </Container>
                    <Button
                      variant={showAllGroups ? 'outline-primary' : 'primary'}
                      className="w-100 mt-3"
                      onClick={() => setShowAllGroups(!showAllGroups)}
                    >
                      {showAllGroups
                        ? 'Go Back'
                        : 'Show All (' + searchResults.groups.length + ')'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          {searchResults.users.length > 0 &&
            !showAllGroups &&
            !showAllPosts && (
              <Col lg={8}>
                <Card className="bg-body-tertiary">
                  <Card.Body>
                    <h4 className="mb-3">Users</h4>
                    <Container fluid>
                      <Row xs={2} sm={3} xxl={4} className="g-3">
                        {showAllUsers
                          ? searchResults.users.map((el) => (
                              <Col key={el.id}>
                                <img
                                  src={el.proPicUrl}
                                  alt="profile-picture"
                                  className="nav-propic cursor-pointer me-2"
                                  onClick={() => navigate(`/profile/${el.id}`)}
                                />
                                <Link
                                  to={`/profile/${el.id}`}
                                  className="link-body-emphasis"
                                >
                                  {el.username}
                                </Link>
                              </Col>
                            ))
                          : searchResults.users
                              .filter((el, i) => i < 6)
                              .map((el) => (
                                <Col key={el.id}>
                                  <img
                                    src={el.proPicUrl}
                                    alt="profile-picture"
                                    className="nav-propic cursor-pointer me-2"
                                    onClick={() =>
                                      navigate(`/profile/${el.id}`)
                                    }
                                  />
                                  <Link
                                    to={`/profile/${el.id}`}
                                    className="link-body-emphasis"
                                  >
                                    {el.username}
                                  </Link>
                                </Col>
                              ))}
                      </Row>
                    </Container>
                    <Button
                      variant={showAllUsers ? 'outline-primary' : 'primary'}
                      className="w-100 mt-3"
                      onClick={() => setShowAllUsers(!showAllUsers)}
                    >
                      {showAllUsers
                        ? 'Go Back'
                        : 'Show All (' + searchResults.users.length + ')'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          {(searchResults.posts.length > 0 ||
            searchResults.comments.length > 0) &&
            !showAllUsers &&
            !showAllGroups && (
              <Col lg={8}>
                <h4>#{location.search.replace('?query=', '')}</h4>
                <hr className="mb-4" />
                {showAllPosts
                  ? searchResults.posts.map((el) => (
                      <Post key={el.id} data={el} />
                    ))
                  : searchResults.posts
                      .filter((el, i) => i < 3)
                      .map((el) => <Post key={el.id} data={el} />)}
                <Button
                  variant={showAllPosts ? 'outline-primary' : 'primary'}
                  className="w-100 mt-3"
                  onClick={() => setShowAllPosts(!showAllPosts)}
                >
                  {showAllPosts
                    ? 'Go Back'
                    : 'Show All (' + searchResults.posts.length + ')'}
                </Button>
              </Col>
            )}
        </Row>
      </Container>
    )
  )
}

export default SearchPage
