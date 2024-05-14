/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Container, Row, Col, Button, Spinner, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { clearData } from '../../redux/actions'

const DeleteAccount = ({
  showSetting,
  setShowSetting,
  setShowMenu,
  isDisabled,
}) => {
  const accessToken = localStorage.getItem('accessToken')
  const [isLoading, setLoading] = useState(false)
  const [isChecked, setChecked] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const dispatch = useDispatch()

  const deleteAccount = async () => {
    setErrorMsg('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3030/api/users/me', {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        localStorage.removeItem('accessToken')
        dispatch(clearData())
        setLoading(false)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      let msg = '' + error
      msg = msg.slice(msg.indexOf(' ') + 1)
      setErrorMsg(msg)
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    deleteAccount()
  }

  return (
    <Container
      id="delete-account"
      className={showSetting ? 'vanish-right' : 'position-absolute'}
    >
      <Row>
        <Col>
          <Form onSubmit={handleSubmit} className="text-center">
            <p className="fs-5 fw-semibold">
              Are you sure you want to{' '}
              <span className="fw-bold">permanently delete</span> your account?
            </p>
            <div className="my-3 text-start">
              <Form.Check
                className="mb-2"
                label="I understand that this process is irreversible and I want to proceed."
                required
                checked={isChecked}
                onClick={() => setChecked(!isChecked)}
                disabled={isDisabled}
              />
              {errorMsg !== '' && (
                <Form.Text className="text-danger fs-5 fw-semibold">
                  {errorMsg}
                </Form.Text>
              )}
            </div>
            <div className="my-3">
              <div className={isDisabled ? '' : 'd-none'}>
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" size="sm" className="mx-1" />
                <Spinner animation="grow" size="sm" />
              </div>
            </div>
            <div>
              <Button
                variant="outline-secondary"
                className="me-1"
                onClick={() => {
                  setShowMenu(true)
                  setShowSetting(false)
                  setErrorMsg('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="submit"
                disabled={isChecked && !isLoading ? false : true}
              >
                {isLoading ? <Spinner size="sm" /> : 'Confirm'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default DeleteAccount
