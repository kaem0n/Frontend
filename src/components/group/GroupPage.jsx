import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tab,
  Tabs,
  Tooltip,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Board from '../Board'
import CreatePost from '../post/CreatePost'
import GroupManagement from './GroupManagement'
import GroupInfo from './GroupInfo'

const GroupPage = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const isLoading = useSelector((state) => state.isLoading)
  const [reloadTrigger, setReloadTrigger] = useState(true)
  const [info, setInfo] = useState(null)
  const [isMember, setMember] = useState(false)
  const [membershipData, setMembershipData] = useState(null)
  const inputFile = useRef()
  const params = useParams()

  const fetchGroupAction = async (endPoint, method) => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/groups/${params.groupID}${endPoint}`,
        {
          method: method,
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const result = await res.json()
        console.log(result)
        setReloadTrigger(!reloadTrigger)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeCover = async () => {
    const file = inputFile.current.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await fetch(
          `http://localhost:3030/api/groups/${params.groupID}/changeCover`,
          {
            method: 'PATCH',
            headers: {
              Authorization: accessToken,
            },
            body: formData,
          }
        )
        if (res.ok) {
          setReloadTrigger(!reloadTrigger)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const removeCover = async () => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/groups/${params.groupID}/removeCover`,
        {
          method: 'PATCH',
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        setReloadTrigger(!reloadTrigger)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
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
          setMember(true)
          setMembershipData(data)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
        setMember(false)
      }
    }

    fillInfo()
    checkMembership()

    return () => {
      ignore = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, reloadTrigger])

  return (
    info && (
      <Container fluid="lg">
        <Row>
          <Col>
            <div>
              <div className="position-relative">
                {info.group.coverUrl ? (
                  <img
                    src={info.group.coverUrl}
                    alt="group-cover"
                    className="group-cover rounded-top-3"
                  />
                ) : (
                  <div className="group-cover bg-secondary rounded-top-3"></div>
                )}
                {membershipData.admin && (
                  <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                    {info.group.coverUrl && (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>Delete group cover</Tooltip>}
                      >
                        <Button
                          variant="secondary"
                          className="fs-5 rounded-2 px-2 py-1 me-2 text-black"
                          onClick={removeCover}
                        >
                          <i className="fa-solid fa-eraser"></i>
                        </Button>
                      </OverlayTrigger>
                    )}
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Change group cover</Tooltip>}
                    >
                      <Button
                        variant="info"
                        className="fs-5 rounded-2 px-2 py-1"
                        onClick={() => inputFile.current.click()}
                      >
                        <i className="fa-solid fa-camera"></i>
                      </Button>
                    </OverlayTrigger>
                  </div>
                )}
                <input
                  type="file"
                  ref={inputFile}
                  className="d-none"
                  onChange={changeCover}
                />
              </div>
              <div className="bg-body-tertiary p-3">
                <h1 className="fw-bold">{info.group.name}</h1>
                <div className="d-flex justify-content-between align-items-center">
                  <p>
                    Members:{' '}
                    {
                      info.memberships.filter(
                        (membership) => !membership.banned
                      ).length
                    }{' '}
                    · Posts: {info.board.totalElements}
                  </p>
                  <div>
                    <Button
                      variant={
                        isMember && membershipData.following
                          ? 'outline-info'
                          : 'info'
                      }
                      size="sm"
                      className="me-2"
                      onClick={() => fetchGroupAction('/follow', 'POST')}
                      disabled={
                        (isMember && membershipData.banned) || !isMember
                      }
                    >
                      {isMember && membershipData.following
                        ? 'Unfollow'
                        : 'Follow'}
                    </Button>
                    <Button
                      variant={
                        isMember && !membershipData.banned
                          ? 'outline-primary'
                          : 'primary'
                      }
                      size="sm"
                      onClick={() =>
                        isMember
                          ? fetchGroupAction('/leave', 'POST')
                          : fetchGroupAction('/join', 'POST')
                      }
                      disabled={
                        (isMember && membershipData.banned) ||
                        info.group.founder.id === user.id
                      }
                    >
                      {isMember && !membershipData.banned ? 'Leave' : 'Join'}
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
                <Container className="mb-5" fluid>
                  <Row>
                    <Col md={8}>
                      {isMember && !membershipData.banned && (
                        <CreatePost boardID={info.group.board.id} />
                      )}
                      <Board
                        id={info.group.board.id}
                        disabled={!isMember || membershipData.banned}
                      />
                    </Col>
                    <Col xs={4} className="d-none d-md-block">
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
                <GroupInfo info={info} />
              </Tab>
              {membershipData.admin && (
                <Tab eventKey="manage" title="Manage">
                  <GroupManagement
                    trigger={reloadTrigger}
                    setTrigger={setReloadTrigger}
                    fetchGroupAction={fetchGroupAction}
                    info={info}
                  />
                </Tab>
              )}
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
  )
}

export default GroupPage
