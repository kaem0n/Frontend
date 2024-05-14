/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad, load, trigger } from '../../redux/actions'

const ChangePassword = ({ showSetting, setShowSetting, setShowMenu }) => {
  const accessToken = localStorage.getItem('accessToken')
  const isLoading = useSelector((state) => state.isLoading)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [oldPasswordField, setOldPasswordField] = useState('')
  const [newPasswordField, setNewPasswordField] = useState('')
  const dispatch = useDispatch()

  const changePassword = async () => {
    setErrorMsg('')
    dispatch(load())

    try {
      const res = await fetch(
        'http://localhost:3030/api/users/me/changePassword',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
          body: JSON.stringify({
            oldPassword: oldPasswordField,
            newPassword: newPasswordField,
          }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        setSuccessMsg(data.responseMessage)
        setTimeout(() => {
          dispatch(trigger())
          setShowSetting(false)
          setShowMenu(true)
          setOldPasswordField('')
          setNewPasswordField('')
          setSuccessMsg('')
          dispatch(endLoad())
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

  const handleSubmit = (e) => {
    e.preventDefault()
    changePassword()
  }

  return (
    <Container
      id="change-password"
      className={showSetting ? 'vanish-right' : 'position-absolute'}
    >
      <Row>
        <Col>
          <Form
            onSubmit={(e) =>
              handleSubmit(e, 'Password', oldPasswordField, newPasswordField)
            }
          >
            <p className="mb-2">Insert your old password:</p>
            <div className="mb-2">
              <Form.Control
                type="password"
                value={oldPasswordField}
                onChange={(e) => setOldPasswordField(e.target.value)}
              />
              {errorMsg !== '' && errorMsg.includes('Old password') && (
                <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
              )}
            </div>
            <p className="mb-2">Choose a new password:</p>
            <div className="mb-2">
              <Form.Control
                type="password"
                value={newPasswordField}
                onChange={(e) => setNewPasswordField(e.target.value)}
              />
              {errorMsg !== '' && !errorMsg.includes('Old password') && (
                <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
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
                  setShowSetting(false)
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
                  oldPasswordField === '' ||
                  newPasswordField === '' ||
                  isLoading
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
  )
}

export default ChangePassword
