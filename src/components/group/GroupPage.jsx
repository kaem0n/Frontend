import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Board from '../Board'
import CreatePost from '../post/CreatePost'

const GroupPage = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const isLoading = useSelector((state) => state.isLoading)
  const [info, setInfo] = useState(null)
  const [membershipData, setMembershipData] = useState(null)
  const params = useParams()

  useEffect(() => {
    let ignore = true

    const getGroupData = async () => {
      const res = await fetch(
        `http://localhost:3030/api/groups/${params.groupID}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        return res.json()
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    }

    const getMemberships = async () => {
      const res = await fetch(
        `http://localhost:3030/api/groups/${params.groupID}/memberships`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        return res.json()
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    }

    const getBoardData = async (boardID) => {
      const res = await fetch(
        `http://localhost:3030/api/posts/byBoard/${boardID}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        return res.json()
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    }

    const fillInfo = async () => {
      let groupData
      let memberships
      let boardData
      try {
        groupData = await getGroupData()
        memberships = await getMemberships()
        boardData = await getBoardData(groupData.board.id)
      } catch (error) {
        console.log(error)
      } finally {
        const info = {
          group: groupData,
          memberships: memberships,
          board: boardData,
        }
        console.log(info)
        setInfo(info)
      }
    }

    const checkMembership = async () => {
      try {
        const res = await fetch(
          `http://localhost:3030/api/groups/${params.groupID}/checkMembership`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          setMembershipData(data)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fillInfo()
    checkMembership()

    return () => {
      ignore = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    info && (
      <Container>
        <Row>
          <Col>
            <div>
              {info.group.coverUrl && (
                <img
                  src={info.group.coverUrl}
                  alt="group-cover"
                  className="group-cover rounded-top-3"
                />
              )}
              <div className="bg-body-tertiary p-3">
                <h1 className="fw-bold">{info.group.name}</h1>
                <div className="d-flex justify-content-between align-items-center">
                  <p>
                    Members: {info.memberships.length} · Posts:{' '}
                    {info.board.totalElements}
                  </p>
                  <div>
                    <Button
                      variant={
                        membershipData.following ? 'outline-info' : 'info'
                      }
                      size="sm"
                      className="me-2"
                      disabled={
                        (membershipData && membershipData.banned) ||
                        !membershipData
                      }
                    >
                      {membershipData.following ? 'Unfollow' : 'Follow'}
                    </Button>
                    <Button
                      variant={
                        membershipData && !membershipData.banned
                          ? 'outline-primary'
                          : 'primary'
                      }
                      size="sm"
                      disabled={
                        (membershipData && membershipData.banned) ||
                        info.group.founder.id === user.id
                      }
                    >
                      {membershipData && !membershipData.banned
                        ? 'Leave'
                        : 'Join'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Tabs
              defaultActiveKey="board"
              className="mb-3 px-1 bg-body-tertiary"
              unmountOnExit
            >
              <Tab eventKey="board" title="Board">
                <Container>
                  <Row>
                    <Col xs={8}>
                      {membershipData && !membershipData.banned && (
                        <CreatePost boardID={info.group.board.id} />
                      )}
                      <Board id={info.group.board.id} />
                    </Col>
                    <Col xs={4} className="">
                      <Card className="bg-body-tertiary overflow-auto sticky-top top-8">
                        <Card.Body>
                          <h5>About this group</h5>
                          <p className="line-break mb-2">
                            {info.group.description}
                          </p>
                          <p className="fs-7">
                            Founder:{' '}
                            <Link
                              to={`/profile/${info.group.founder.id}`}
                              className="link-body-emphasis"
                            >
                              {info.group.founder.username}
                            </Link>
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Tab>
              <Tab eventKey="info" title="Info">
                PLACEHOLDER
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
  )
}

export default GroupPage
