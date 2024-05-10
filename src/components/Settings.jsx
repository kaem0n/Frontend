/* eslint-disable react/prop-types */
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Settings = ({ user }) => {
  return (
    <Container className="mt-5" fluid>
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <Card.Header as="h5">Account Settings</Card.Header>
            <Card.Body className="px-1">
              <Container fluid>
                <Row>
                  <Col xs={4} className="border-end text-end">
                    <p className="mb-2">Username</p>
                    <p className="mb-2">Email</p>
                    <p className="mb-2">Password</p>
                    <p className="mb-2">Account management</p>
                  </Col>
                  {user && (
                    <Col xs={8} className="flex-grow-1 d-flex flex-column">
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p>{user.username}</p>
                        <p className="link-info cursor-pointer fs-7">
                          Change username
                        </p>
                      </div>
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p>{user.email}</p>
                        <p className="link-info cursor-pointer fs-7">
                          Change email
                        </p>
                      </div>
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p>●●●●●●●●</p>
                        <p className="link-info cursor-pointer fs-7">
                          Change password
                        </p>
                      </div>
                      <div className="mb-2 d-flex justify-content-between align-items-end flex-grow-1">
                        <div></div>
                        <p className="link-danger cursor-pointer fs-7">
                          Delete account
                        </p>
                      </div>
                    </Col>
                  )}
                </Row>
              </Container>
            </Card.Body>
            <Card.Footer className="text-end">
              <Link to="/" className="btn btn-outline-info btn-sm">
                Go back
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Settings
