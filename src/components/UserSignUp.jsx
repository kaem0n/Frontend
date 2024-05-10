import { Form, Card, Col, Container, Row, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useState } from 'react'

const UserSignUp = () => {
  const [emailField, setEmailField] = useState('')
  const [usernameField, setUsernameField] = useState('')
  const [passwordField, setPasswordField] = useState('')
  const navigate = useNavigate()

  const register = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailField,
          username: usernameField,
          password: passwordField,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register()
    navigate('/')
  }

  return (
    <div className="pt-5 bg-body-tertiary vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        <div className="mb-5 text-center text-secondary">
          <h1 className="righteous">Welcome to</h1>
          <img src="logo.png" alt="logo" height="70px" />
        </div>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={8} md={6} lg={4} xxl={3}>
              <Card>
                <Card.Body>
                  <Card.Title className="mb-3 fs-4">
                    Create your account
                  </Card.Title>
                  <Form className="mb-3" onSubmit={handleSubmit}>
                    <Form.Control
                      type="email"
                      placeholder="Insert your email"
                      className="py-2 mb-3"
                      value={emailField}
                      onChange={(e) => setEmailField(e.target.value)}
                      required
                    />
                    <Form.Control
                      placeholder="Choose an username"
                      className="py-2 mb-3"
                      minLength={3}
                      maxLength={20}
                      value={usernameField}
                      onChange={(e) => setUsernameField(e.target.value)}
                      required
                    />
                    <Form.Control
                      type="password"
                      placeholder="Choose a password"
                      className="py-2"
                      minLength={8}
                      value={passwordField}
                      onChange={(e) => setPasswordField(e.target.value)}
                      required
                    />
                    <Form.Text className="fs-8 m-0 d-flex align-items-center">
                      <i className="bi bi-info-circle me-1 fs-7"></i>Password
                      length must be at least 8 characters long.
                    </Form.Text>
                    <Form.Check
                      label="I agree to the Terms of Service and Privacy Policy, including Cookie Use."
                      className="my-3"
                      required
                    />
                    <div className="d-flex">
                      <Button type="submit" className="flex-grow-1">
                        Create account
                      </Button>
                    </div>
                  </Form>
                  <p>
                    Already have an account?{' '}
                    <Link to="/" className="link-info">
                      Sign in
                    </Link>
                    .
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  )
}

export default UserSignUp
