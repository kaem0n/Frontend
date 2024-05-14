import {
  Form,
  Card,
  Col,
  Container,
  Row,
  Button,
  Spinner,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad, load } from '../redux/actions'

const UserSignUp = () => {
  const isLoading = useSelector((state) => state.isLoading)
  const [emailField, setEmailField] = useState('')
  const [usernameField, setUsernameField] = useState('')
  const [passwordField, setPasswordField] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
        const accessToken = 'Bearer ' + data.accessToken
        localStorage.setItem('accessToken', accessToken)
        window.location.reload()
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      dispatch(endLoad())
      setErrorMsg(`${error}`)
    }
  }

  const register = async () => {
    dispatch(load())
    setShow1(false)
    setShow2(false)
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
        logIn()
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      dispatch(endLoad())
      let msg = '' + error
      msg = msg.slice(msg.indexOf(' ') + 1)
      setErrorMsg(msg)
      if (msg.includes('Email')) {
        setShow1(true)
      } else if (msg.includes('Username')) {
        setShow2(true)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register()
  }

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="pt-5 bg-body-tertiary vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        <div className="mb-5 text-center text-secondary">
          <h1 className="righteous cursor-default">Welcome to</h1>
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
                    <div className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Insert your email"
                        className={
                          show1
                            ? 'py-2 border-danger text-danger shadow-none'
                            : 'py-2'
                        }
                        value={emailField}
                        onChange={(e) => {
                          setEmailField(e.target.value)
                          setShow1(false)
                        }}
                        required
                      />
                      {show1 && (
                        <Form.Text className="text-danger fs-8">
                          {errorMsg}
                        </Form.Text>
                      )}
                    </div>
                    <div className="mb-3">
                      <Form.Control
                        placeholder="Choose an username"
                        className={
                          show2
                            ? 'py-2 border-danger text-danger shadow-none'
                            : 'py-2'
                        }
                        value={usernameField}
                        onChange={(e) => {
                          setUsernameField(e.target.value)
                          setShow2(false)
                        }}
                        required
                      />
                      {show2 && (
                        <Form.Text className="text-danger fs-8">
                          {errorMsg}
                        </Form.Text>
                      )}
                    </div>
                    <Form.Control
                      type="password"
                      placeholder="Choose a password"
                      className="py-2"
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
                      <Button
                        type="submit"
                        className="flex-grow-1"
                        disabled={isLoading ? true : false}
                      >
                        {isLoading ? <Spinner size="sm" /> : 'Create account'}
                      </Button>
                    </div>
                  </Form>
                  <p className="text-center">
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
