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

/* eslint-disable react/prop-types */
const ChangeEmail = ({ showSetting, setShowSetting, setShowMenu }) => {
  const accessToken = localStorage.getItem('accessToken')
  const isLoading = useSelector((state) => state.isLoading)
  const [newEmailField, setNewEmailField] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const dispatch = useDispatch()

  const changeEmail = async () => {
    setErrorMsg('')
    dispatch(load())

    try {
      const res = await fetch(
        'http://localhost:3030/api/users/me/changeEmail',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
          },
          body: JSON.stringify({ email: newEmailField }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        setSuccessMsg(data.responseMessage)
        setTimeout(() => {
          dispatch(trigger())
          setShowSetting(false)
          setShowMenu(true)
          setNewEmailField('')
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
    changeEmail()
  }

  return (
    <Container
      id="change-email"
      className={showSetting ? 'vanish-right' : 'position-absolute'}
    >
      <Row>
        <Col>
          <Form onSubmit={(e) => handleSubmit(e, 'Email', newEmailField)}>
            <div className="mb-2">
              <FloatingLabel label="Insert your new email address">
                <Form.Control
                  size="sm"
                  value={newEmailField}
                  onChange={(e) => setNewEmailField(e.target.value)}
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
                  setNewEmailField('')
                  setErrorMsg('')
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={newEmailField === '' || isLoading ? true : false}
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

export default ChangeEmail
