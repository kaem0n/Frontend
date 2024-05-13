import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad, load, trigger } from '../redux/actions'

const Settings = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const isLoading = useSelector((state) => state.isLoading)
  const [showMenu, setShowMenu] = useState(true)
  const [showSetting1, setShowSetting1] = useState(false)
  const [showSetting2, setShowSetting2] = useState(false)
  const [showSetting3, setShowSetting3] = useState(false)
  const [newUsernameField, setNewUsernameField] = useState('')
  const [newEmailField, setNewEmailField] = useState('')
  const [oldPasswordField, setOldPasswordField] = useState('')
  const [newPasswordField, setNewPasswordField] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const dispatch = useDispatch()

  const changeParameter = async (parameter, value1, value2) => {
    setErrorMsg('')
    dispatch(load())
    let payload

    if (parameter === 'Username') {
      payload = { username: value1 }
    } else if (parameter === 'Email') {
      payload = { email: value1 }
    } else if (parameter === 'Password') {
      payload = { oldPassword: value1, newPassword: value2 }
    }

    try {
      const res = await fetch(
        'http://localhost:3030/api/users/me/change' + parameter,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
          body: JSON.stringify(payload),
        }
      )
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        setSuccessMsg(data.responseMessage)
        dispatch(endLoad())
        dispatch(trigger())
        setTimeout(() => {
          setShowSetting1(false)
          setShowSetting2(false)
          setShowSetting3(false)
          setShowMenu(true)
          setNewUsernameField('')
          setNewEmailField('')
          setNewPasswordField('')
          setOldPasswordField('')
          setSuccessMsg('')
        }, 1000)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      let msg = '' + error
      msg = msg.slice(msg.indexOf(' ') + 1)
      setErrorMsg(msg)
      dispatch(endLoad())
    }
  }

  const handleSubmit = (e, parameter, value1, value2) => {
    e.preventDefault()
    changeParameter(parameter, value1, value2)
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card>
            <Card.Header as="h5">Account Settings</Card.Header>
            <Card.Body className="px-1">
              <Container
                fluid
                id="settings-menu"
                className={showMenu ? '' : 'vanish-left position-absolute'}
              >
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
                        <button
                          className="btn-clean link-info fs-7"
                          onClick={() => {
                            setShowMenu(false)
                            setShowSetting1(true)
                          }}
                          disabled={!showMenu}
                        >
                          Change username
                        </button>
                      </div>
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p>{user.email}</p>
                        <button
                          className="btn-clean link-info fs-7"
                          onClick={() => {
                            setShowMenu(false)
                            setShowSetting2(true)
                          }}
                          disabled={!showMenu}
                        >
                          Change email
                        </button>
                      </div>
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p>●●●●●●●●</p>
                        <button
                          className="btn-clean link-info fs-7"
                          onClick={() => {
                            setShowMenu(false)
                            setShowSetting3(true)
                          }}
                          disabled={!showMenu}
                        >
                          Change password
                        </button>
                      </div>
                      <div className="mb-2 d-flex justify-content-between align-items-end flex-grow-1">
                        <div></div>
                        <button className="btn-clean link-danger fs-7">
                          Delete account
                        </button>
                      </div>
                    </Col>
                  )}
                </Row>
              </Container>
              <Container
                id="change-username"
                className={showSetting1 ? 'vanish-right' : 'position-absolute'}
              >
                <Row>
                  <Col>
                    <Form
                      onSubmit={(e) =>
                        handleSubmit(e, 'Username', newUsernameField)
                      }
                    >
                      <p className="mb-2">Choose a new username:</p>
                      <div className="mb-2">
                        <Form.Control
                          value={newUsernameField}
                          onChange={(e) => setNewUsernameField(e.target.value)}
                        />
                        {errorMsg !== '' && (
                          <Form.Text className="text-danger fs-8">
                            {errorMsg}
                          </Form.Text>
                        )}
                        {successMsg !== '' && (
                          <Form.Text className="text-success fs-8">
                            {successMsg}
                          </Form.Text>
                        )}
                      </div>
                      <div className="text-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setShowMenu(true)
                            setShowSetting1(false)
                            setNewUsernameField('')
                            setErrorMsg('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={newUsernameField === '' ? true : false}
                        >
                          {isLoading ? <Spinner size="sm" /> : 'Apply'}
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </Container>
              <Container
                id="change-email"
                className={showSetting2 ? 'vanish-right' : 'position-absolute'}
              >
                <Row>
                  <Col>
                    <Form
                      onSubmit={(e) => handleSubmit(e, 'Email', newEmailField)}
                    >
                      <p className="mb-2">Choose a new email:</p>
                      <div className="mb-2">
                        <Form.Control
                          value={newEmailField}
                          onChange={(e) => setNewEmailField(e.target.value)}
                        />
                        {errorMsg !== '' && (
                          <Form.Text className="text-danger fs-8">
                            {errorMsg}
                          </Form.Text>
                        )}
                        {successMsg !== '' && (
                          <Form.Text className="text-success fs-8">
                            {successMsg}
                          </Form.Text>
                        )}
                      </div>
                      <div className="text-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setShowMenu(true)
                            setShowSetting2(false)
                            setNewEmailField('')
                            setErrorMsg('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={newEmailField === '' ? true : false}
                        >
                          {isLoading ? <Spinner size="sm" /> : 'Apply'}
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </Container>
              <Container
                id="change-password"
                className={showSetting3 ? 'vanish-right' : 'position-absolute'}
              >
                <Row>
                  <Col>
                    <Form
                      onSubmit={(e) =>
                        handleSubmit(
                          e,
                          'Password',
                          oldPasswordField,
                          newPasswordField
                        )
                      }
                    >
                      <p className="mb-2">Insert your old password:</p>
                      <div className="mb-2">
                        <Form.Control
                          type="password"
                          value={oldPasswordField}
                          onChange={(e) => setOldPasswordField(e.target.value)}
                        />
                        {errorMsg !== '' &&
                          errorMsg.includes('Old password') && (
                            <Form.Text className="text-danger fs-8">
                              {errorMsg}
                            </Form.Text>
                          )}
                      </div>
                      <p className="mb-2">Choose a new password:</p>
                      <div className="mb-2">
                        <Form.Control
                          type="password"
                          value={newPasswordField}
                          onChange={(e) => setNewPasswordField(e.target.value)}
                        />
                        {errorMsg !== '' &&
                          !errorMsg.includes('Old password') && (
                            <Form.Text className="text-danger fs-8">
                              {errorMsg}
                            </Form.Text>
                          )}
                        {successMsg !== '' && (
                          <Form.Text className="text-success fs-8">
                            {successMsg}
                          </Form.Text>
                        )}
                      </div>
                      <div className="text-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setShowMenu(true)
                            setShowSetting3(false)
                            setOldPasswordField('')
                            setNewPasswordField('')
                            setErrorMsg('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={
                            oldPasswordField === '' || newPasswordField === ''
                              ? true
                              : false
                          }
                        >
                          {isLoading ? <Spinner size="sm" /> : 'Apply'}
                        </Button>
                      </div>
                    </Form>
                  </Col>
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
