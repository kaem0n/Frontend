import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EmojiMenu from '../post/EmojiMenu'
import { useSelector } from 'react-redux'

/* eslint-disable react/prop-types */
const GroupManagement = ({ trigger, setTrigger, fetchGroupAction, info }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [nameField, setNameField] = useState('')
  const [showNameField, setShowNameField] = useState(false)
  const [descriptionField, setDescriptionField] = useState('')
  const [showDescriptionField, setShowDescriptionField] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTimer, setDeleteTimer] = useState(5)
  const timerRef = useRef()
  const counter = useRef(10)
  const navigate = useNavigate()
  const params = useParams()

  const printMembers = (callBack) => {
    let filtered
    if (callBack)
      filtered = info.memberships
        .filter(callBack)
        .sort((membership1, membership2) => membership1.id - membership2.id)
    else
      filtered = info.memberships.sort(
        (membership1, membership2) => membership1.id - membership2.id
      )

    if (filtered.length < counter.current) {
      return filtered.map((membership) => (
        <div
          key={membership.id}
          className="d-flex justify-content-between mb-3"
        >
          <div className="d-flex align-items-center">
            <img
              src={membership.user.proPicUrl}
              alt="propic"
              className="nav-propic me-2 cursor-pointer"
              onClick={() => navigate(`/profile/${membership.user.id}`)}
            />
            <Link
              to={`/profile/${membership.user.id}`}
              className="link-body-emphasis underline fw-semibold"
            >
              {membership.user.username}{' '}
              {membership.user.id === info.group.founder.id && '(Founder)'}
            </Link>
          </div>
          <div
            className={
              membership.user.id === info.group.founder.id
                ? 'd-none'
                : 'd-flex align-items-center'
            }
          >
            {user.id !== membership.user.id && (
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip>{membership.banned ? 'Unban' : 'Ban'}</Tooltip>
                }
              >
                <Button
                  variant={membership.banned ? 'outline-danger' : 'danger'}
                  size="sm"
                  className="me-2 py-0"
                  onClick={() =>
                    fetchGroupAction(
                      `/ban?userID=${membership.user.id}`,
                      'PATCH'
                    )
                  }
                >
                  {membership.banned ? (
                    <i className="bi bi-person-fill-check fs-5"></i>
                  ) : (
                    <i className="bi bi-person-fill-slash fs-5"></i>
                  )}
                </Button>
              </OverlayTrigger>
            )}
            {user.id === info.group.founder.id && !membership.banned && (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip>{membership.admin ? 'Demote' : 'Promote'}</Tooltip>
                }
              >
                <Button
                  variant={membership.admin ? 'outline-primary' : 'primary'}
                  size="sm"
                  className="py-0"
                  onClick={() =>
                    fetchGroupAction(
                      `/promote?userID=${membership.user.id}`,
                      'PATCH'
                    )
                  }
                >
                  {membership.admin ? (
                    <i className="bi bi-person-fill-down fs-5"></i>
                  ) : (
                    <i className="bi bi-person-fill-up fs-5"></i>
                  )}
                </Button>
              </OverlayTrigger>
            )}
          </div>
        </div>
      ))
    } else {
      const arr = filtered.filter((membership, i) => i < counter.current)

      return (
        <div>
          {arr.map((membership) => (
            <div key={membership.id} className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  src={membership.user.proPicUrl}
                  alt="propic"
                  className="nav-propic me-2 cursor-pointer"
                  onClick={() => navigate(`/profile/${membership.user.id}`)}
                />
                <Link
                  to={`/profile/${membership.user.id}`}
                  className="link-body-emphasis underline fw-semibold"
                >
                  {membership.user.username}{' '}
                  {membership.user.id === info.group.founder.id && '(Founder)'}
                </Link>
              </div>
              <div
                className={
                  membership.user.id === info.group.founder.id
                    ? 'd-none'
                    : 'd-flex align-items-center'
                }
              >
                {user.id !== membership.user.id && (
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip>{membership.banned ? 'Unban' : 'Ban'}</Tooltip>
                    }
                  >
                    <Button
                      variant={membership.banned ? 'outline-danger' : 'danger'}
                      size="sm"
                      className="me-2 py-0"
                      onClick={() =>
                        fetchGroupAction(
                          `/ban?userID=${membership.user.id}`,
                          'PATCH'
                        )
                      }
                    >
                      {membership.banned ? (
                        <i className="bi bi-person-fill-check fs-5"></i>
                      ) : (
                        <i className="bi bi-person-fill-slash fs-5"></i>
                      )}
                    </Button>
                  </OverlayTrigger>
                )}
                {user.id === info.group.founder.id && !membership.banned && (
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip>
                        {membership.admin ? 'Demote' : 'Promote'}
                      </Tooltip>
                    }
                  >
                    <Button
                      variant={membership.admin ? 'outline-primary' : 'primary'}
                      size="sm"
                      className="py-0"
                      onClick={() =>
                        fetchGroupAction(
                          `/promote?userID=${membership.user.id}`,
                          'PATCH'
                        )
                      }
                    >
                      {membership.admin ? (
                        <i className="bi bi-person-fill-down fs-5"></i>
                      ) : (
                        <i className="bi bi-person-fill-up fs-5"></i>
                      )}
                    </Button>
                  </OverlayTrigger>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn-clean"
            onClick={() => (counter.current += 10)}
          >
            Load more ({filtered.length - counter.current} remaining)
          </button>
        </div>
      )
    }
  }

  const updateGroup = async () => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/groups/${params.groupID}`,
        {
          method: 'PUT',
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: nameField,
            description: descriptionField,
          }),
        }
      )
      if (res.ok) {
        setTrigger(!trigger)
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
    setShowNameField(false)
    setShowDescriptionField(false)
    updateGroup()
  }

  useEffect(() => {}, [counter])

  useEffect(() => {
    setDeleteTimer(5)
    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setDeleteTimer((prev) => prev - 1)
    }, 1000)
  }, [showDeleteDialog])

  useEffect(() => {
    if (deleteTimer === 0) clearInterval(timerRef.current)
  }, [deleteTimer])

  return (
    <Container className="mb-5">
      <Row>
        <Col xs={7}>
          <Card className="bg-body-tertiary">
            <Card.Body className="pb-0">
              <div>
                <h5>Administration:</h5>
                {printMembers((membership) => membership.admin)}
              </div>
              <div>
                <h5>Members:</h5>
                {printMembers((membership) => !membership.admin)}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={5}>
          <Card className="bg-body-tertiary sticky-top top-8">
            <Card.Header>
              <h4 className="mb-1">Settings</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Container fluid className="p-0">
                  <h5>Group name:</h5>
                  <Row className="mb-3">
                    <Col xs={1}>
                      <button
                        type="button"
                        className="btn-clean"
                        onClick={() => {
                          setNameField(info.group.name)
                          setDescriptionField(info.group.description)
                          setShowNameField(!showNameField)
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </Col>
                    <Col xs={11}>
                      {showNameField ? (
                        <div>
                          <Form.Control
                            className="px-1 py-0"
                            value={nameField}
                            onChange={(e) => setNameField(e.target.value)}
                          />
                          <div className="d-flex justify-content-end">
                            <EmojiMenu
                              value={nameField}
                              setValue={setNameField}
                              className="text-secondary me-2"
                            />
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Confirm</Tooltip>}
                            >
                              <button
                                className="btn-clean"
                                disabled={
                                  nameField === info.group.name ||
                                  nameField.length < 3
                                }
                              >
                                <i className="bi bi-send-fill text-primary"></i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </div>
                      ) : (
                        <p>{info.group.name}</p>
                      )}
                    </Col>
                  </Row>
                  <h5>Description:</h5>
                  <Row>
                    <Col xs={1}>
                      <button
                        type="button"
                        className="btn-clean"
                        onClick={() => {
                          setNameField(info.group.name)
                          setDescriptionField(info.group.description)
                          setShowDescriptionField(!showDescriptionField)
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </Col>
                    <Col xs={11}>
                      {showDescriptionField ? (
                        <div>
                          <Form.Control
                            as="textarea"
                            className="px-1 py-0"
                            value={descriptionField}
                            onChange={(e) =>
                              setDescriptionField(e.target.value)
                            }
                            rows={4}
                          />
                          <div className="d-flex justify-content-end">
                            <EmojiMenu
                              value={descriptionField}
                              setValue={setDescriptionField}
                              className="text-secondary me-2"
                            />
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Confirm</Tooltip>}
                            >
                              <button
                                className="btn-clean"
                                disabled={
                                  descriptionField === info.group.description
                                }
                              >
                                <i className="bi bi-send-fill text-primary"></i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </div>
                      ) : (
                        <p className="line-break">{info.group.description}</p>
                      )}
                    </Col>
                  </Row>
                </Container>
              </Form>
            </Card.Body>
            {info.group.founder.id === user.id && (
              <Card.Footer>
                {showDeleteDialog ? (
                  <Form className="text-center">
                    <p className="mb-2">
                      Are you sure you want to proceed? This action is
                      permanent.
                    </p>
                    <div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setShowDeleteDialog(false)
                        }}
                      >
                        Go back
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          fetchGroupAction('', 'DELETE')
                          navigate('/')
                        }}
                        disabled={deleteTimer !== 0}
                      >
                        {deleteTimer === 0 ? 'Confirm' : deleteTimer}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <button
                    type="button"
                    className="btn-clean text-danger"
                    onClick={() => {
                      setShowDeleteDialog(true)
                    }}
                  >
                    Delete group
                  </button>
                )}
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default GroupManagement
