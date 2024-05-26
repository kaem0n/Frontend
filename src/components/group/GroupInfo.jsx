import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import dateFormatter from '../../utils/dateFormatter'
import { useRef, useState } from 'react'

/* eslint-disable react/prop-types */
const GroupInfo = ({ info }) => {
  const user = useSelector((state) => state.profile)
  const [search, setSearch] = useState('')
  const counter = useRef(12)
  const navigate = useNavigate()

  const printAdmins = () => {
    return info.memberships
      .filter(
        (membership) =>
          membership.admin && membership.user.id !== info.group.founder.id
      )
      .map((membership) => (
        <div key={membership.id} className="d-flex align-items-center mt-3">
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
            {membership.user.username}
          </Link>
        </div>
      ))
  }

  const printMembers = () => {
    const filtered = info.memberships.filter(
      (membership, i) =>
        membership.user.username.includes(search) && i < counter.current
    )
    return (
      <>
        {filtered.map((membership) => (
          <Col
            xs={6}
            sm={4}
            xl={3}
            key={membership.id}
            className="d-flex align-items-center mt-3"
          >
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
              {membership.user.username}
            </Link>
          </Col>
        ))}
        {filtered.length > counter.current && (
          <Col xs={12} className="d-flex flex-column mt-3">
            {' '}
            <button
              type="button"
              className="btn-clean"
              onClick={() => (counter.current += 12)}
            >
              Load more ({filtered.length - counter.current} remaining)
            </button>
          </Col>
        )}
      </>
    )
  }

  return (
    <Container className="mb-5" fluid>
      <Row>
        <Col md={4} className="order-md-2 mb-3 mb-md-0">
          <Card className="bg-body-tertiary">
            <Card.Body>
              <div className="mb-3">
                <h5>Founder</h5>
                <div className="d-flex align-items-center mt-3">
                  <img
                    src={info.group.founder.proPicUrl}
                    alt="propic"
                    className="nav-propic me-2 cursor-pointer"
                    onClick={() =>
                      navigate(`/profile/${info.group.founder.id}`)
                    }
                  />
                  <Link
                    to={`/profile/${info.group.founder.id}`}
                    className="link-body-emphasis underline fw-semibold"
                  >
                    {info.group.founder.username}
                  </Link>
                </div>
              </div>
              <div>
                <h5>Admins</h5>
                <div>{printAdmins()}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8} className="order-md-1">
          <Card className="bg-body-tertiary">
            <Card.Body>
              <Container fluid>
                <Row className="mb-3">
                  <Col xs={3} className="border-end text-end fw-semibold">
                    <p>Created</p>
                  </Col>
                  <Col xs={9}>
                    <p>{dateFormatter(info.group.creation, user.dateFormat)}</p>
                  </Col>
                  <Col xs={3} className="border-end text-end fw-semibold">
                    <br />
                  </Col>
                  <Col xs={9}></Col>
                  <Col xs={3} className="border-end text-end fw-semibold">
                    <p>Description</p>
                  </Col>
                  <Col xs={9}>
                    <p className="line-break">{info.group.description}</p>
                  </Col>
                </Row>
                <Row>
                  <h5>Members</h5>
                  <Col xs={12}>
                    <Form.Control
                      className="group-search"
                      placeholder="Search members..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Col>
                  {printMembers()}
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default GroupInfo
