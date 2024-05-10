import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import Footer from './Footer'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
  const [usernameField, setUsernameField] = useState('')
  const [passwordField, setPasswordField] = useState('')

  const logIn = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameField,
          password: passwordField,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        const accessToken = 'Bearer ' + data.accessToken
        localStorage.setItem('accessToken', accessToken)
        window.location.reload()
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
    logIn()
  }

  return (
    <div className="d-flex flex-column vh-100 bg-body-tertiary">
      <Container className="flex-grow-1">
        <Row className="h-100 justify-content-center align-items-center text-center">
          <Col xs={5} className="text-secondary">
            <h1 className="display-3 righteous cursor-default">Welcome to</h1>
            <img src="logo.png" alt="logo" height="100px" />
          </Col>
          <Col xs={5}>
            <Form onSubmit={handleSubmit}>
              <Form.Control
                placeholder="Username"
                className="mb-3"
                value={usernameField}
                onChange={(e) => setUsernameField(e.target.value)}
                required
              />
              <Form.Control
                type="password"
                placeholder="Password"
                className="mb-3"
                value={passwordField}
                onChange={(e) => setPasswordField(e.target.value)}
                required
              />
              <div className="d-flex mb-3">
                <Button type="submit" className="flex-grow-1">
                  Log In
                </Button>
              </div>
              <p>
                Don&apos;t have an account?{' '}
                <Link to="/register" className="link-info">
                  Sign up
                </Link>
                .
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

export default Login
