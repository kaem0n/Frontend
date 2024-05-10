import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import Footer from './Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const UserLogin = () => {
  const [usernameField, setUsernameField] = useState('')
  const [passwordField, setPasswordField] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [show, setShow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate()

  const logIn = async () => {
    setLoading(true)
    setShow(false)
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
      setLoading(false)
      setErrorMsg(`${error}`)
      setShow(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    logIn()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => navigate('/'), [])

  return (
    <div className="d-flex flex-column vh-100 bg-body-tertiary">
      <Container className="flex-grow-1">
        <Row className="h-100 justify-content-evenly align-items-center align-content-center text-center">
          <Col md={6} lg={5} className="text-secondary mb-5 mb-md-0">
            <h1 className="display-3 righteous cursor-default">Welcome to</h1>
            <img src="logo.png" alt="logo" className="w-100" />
          </Col>
          <Col xs={11} sm={9} md={6} lg={5}>
            <Form onSubmit={handleSubmit}>
              <Container fluid>
                <Row>
                  <Col xl={9}>
                    {show && <p className="text-danger fs-7">{errorMsg}</p>}
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
                        {isLoading ? <Spinner size="sm" /> : 'Log In'}
                      </Button>
                    </div>
                    <p>
                      Don&apos;t have an account?{' '}
                      <Link to="/register" className="link-info">
                        Sign up
                      </Link>
                      .
                    </p>
                  </Col>
                </Row>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

export default UserLogin
