import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChangeUsername from './settings/ChangeUsername'
import ChangeEmail from './settings/ChangeEmail'
import ChangePassword from './settings/ChangePassword'
import DeleteAccount from './settings/DeleteAccount'
import UpdateInfo from './settings/UpdateInfo'
import { trigger } from '../redux/actions'
import ChangeDateFormat from './settings/ChangeDateFormat'

const Settings = () => {
  const user = useSelector((state) => state.profile)
  const [showMenu, setShowMenu] = useState(true)
  const [showSetting1, setShowSetting1] = useState(false)
  const [showSetting2, setShowSetting2] = useState(false)
  const [showSetting3, setShowSetting3] = useState(false)
  const [showSetting4, setShowSetting4] = useState(false)
  const [showSetting5, setShowSetting5] = useState(false)
  const [isDisabled, setDisabled] = useState(true)
  const dispatch = useDispatch()

  const infoProgress = () => {
    const max = 6
    let counter = 0
    let percent = 0
    if (user.name) {
      counter++
      percent += 16.67
    }
    if (user.surname) {
      counter++
      percent += 16.67
    }
    if (user.birthday) {
      counter++
      percent += 16.67
    }
    if (user.occupation) {
      counter++
      percent += 16.67
    }
    if (user.hobbies) {
      counter++
      percent += 16.67
    }
    if (user.bio) {
      counter++
      percent += 16.67
    }
    if (percent > 100) {
      percent = 100
    }
    return [percent, counter, max]
  }

  return (
    <Container className="mt-5 h-100">
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
                <Row className="align-items-start">
                  <Col xs={4} className="text-end">
                    <p className="mb-2">Username</p>
                  </Col>
                  <Col xs={8} className="align-self-end border-start">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                      <p className="fs-7">{user.username}</p>
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
                  </Col>
                  <Col xs={4} className="text-end">
                    <p className="mb-2">Email</p>
                  </Col>
                  <Col xs={8} className="align-self-end border-start">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                      <p className="fs-7">{user.email}</p>
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
                  </Col>
                  <Col xs={4} className="text-end">
                    <p className="mb-2">Password</p>
                  </Col>
                  <Col xs={8} className="align-self-end border-start">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                      <p className="fs-7">●●●●●●●●</p>
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
                  </Col>
                  <Col xs={4} className="text-end">
                    <p className="mb-2">Info</p>
                  </Col>
                  <Col xs={8} className="align-self-end border-start">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1 d-flex">
                        <ProgressBar
                          now={infoProgress()[0]}
                          label={infoProgress()[1] + '/' + infoProgress()[2]}
                          className="w-75 me-1"
                          variant={
                            infoProgress()[1] === infoProgress()[2]
                              ? 'info'
                              : 'warning'
                          }
                        />
                        <i
                          className={
                            'fa-solid fa-check text-success' +
                            (infoProgress()[1] === infoProgress()[2]
                              ? ''
                              : ' d-none')
                          }
                        ></i>
                      </div>
                      <button
                        className="btn-clean link-info fs-7"
                        onClick={() => {
                          setShowMenu(false)
                          setShowSetting4(true)
                          dispatch(trigger())
                        }}
                        disabled={!showMenu}
                      >
                        Update info
                      </button>
                    </div>
                  </Col>
                  <Col xs={4} className="text-end"></Col>
                  <Col xs={8} className="align-self-end border-start">
                    <br />
                  </Col>
                  <Col xs={4} className="text-end">
                    <p className="lh-sm">Account management</p>
                  </Col>
                  <Col xs={8} className="align-self-end border-start">
                    <div className="d-flex justify-content-between align-items-center">
                      <div></div>
                      <div className="d-flex flex-column align-items-end flex-grow-1">
                        <ChangeDateFormat />
                        <button
                          className="btn-clean link-danger fs-7"
                          onClick={() => {
                            setShowMenu(false)
                            setShowSetting5(true)
                            setDisabled(true)
                            setTimeout(() => {
                              setDisabled(false)
                            }, 5000)
                          }}
                          disabled={!showMenu}
                        >
                          Delete account
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
              <ChangeUsername
                showSetting={showSetting1}
                setShowSetting={setShowSetting1}
                setShowMenu={setShowMenu}
              />
              <ChangeEmail
                showSetting={showSetting2}
                setShowSetting={setShowSetting2}
                setShowMenu={setShowMenu}
              />
              <ChangePassword
                showSetting={showSetting3}
                setShowSetting={setShowSetting3}
                setShowMenu={setShowMenu}
              />
              <UpdateInfo
                showSetting={showSetting4}
                setShowSetting={setShowSetting4}
                setShowMenu={setShowMenu}
              />
              <DeleteAccount
                showSetting={showSetting5}
                setShowSetting={setShowSetting5}
                setShowMenu={setShowMenu}
                isDisabled={isDisabled}
              />
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
