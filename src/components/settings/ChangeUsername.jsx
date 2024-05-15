/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad, load, trigger } from '../../redux/actions'

const ChangeUsername = ({ showSetting, setShowSetting, setShowMenu }) => {
  const accessToken = localStorage.getItem('accessToken')
  const isLoading = useSelector((state) => state.isLoading)
  const [newUsernameField, setNewUsernameField] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const dispatch = useDispatch()

  const changeUsername = async () => {
    setErrorMsg('')
    dispatch(load())

    try {
      const res = await fetch(
        'http://localhost:3030/api/users/me/changeUsername',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
          body: JSON.stringify({ username: newUsernameField }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        setSuccessMsg(data.responseMessage)
        setTimeout(() => {
          dispatch(trigger())
          setShowSetting(false)
          setShowMenu(true)
          setNewUsernameField('')
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
    changeUsername()
  }

  return (
    <Container
      id="change-username"
      className={showSetting ? 'vanish-right' : 'position-absolute'}
    >
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <div className="mb-2">
              <FloatingLabel label="Choose your new username">
                <Form.Control
                  size="sm"
                  value={newUsernameField}
                  onChange={(e) => setNewUsernameField(e.target.value)}
                />
              </FloatingLabel>
              {errorMsg !== '' && (
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
                  setNewUsernameField('')
                  setErrorMsg('')
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={newUsernameField === '' || isLoading ? true : false}
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

export default ChangeUsername
