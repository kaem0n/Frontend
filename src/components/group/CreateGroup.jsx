import { useRef, useState } from 'react'
import {
  Button,
  FloatingLabel,
  Form,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from 'react-bootstrap'
import EmojiMenu from '../post/EmojiMenu'
import { useNavigate } from 'react-router-dom'

const CreateGroup = () => {
  const accessToken = localStorage.getItem('accessToken')
  const [show, setShow] = useState(false)
  const [fieldFocusCheck, setFieldFocusCheck] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [nameField, setNameField] = useState('')
  const [descriptionField, setDescriptionField] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const descriptionFieldLabel = useRef()
  const navigate = useNavigate()

  const createGroup = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3030/api/groups', {
        method: 'POST',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameField,
          description: descriptionField,
        }),
      })
      if (res.ok) {
        const newGroup = await res.json()
        setSuccessMsg('Group successfully created!')
        setTimeout(() => {
          navigate(`/group/${newGroup.id}`)
        }, 1000)
      } else {
        const err = await res.json()
        throw new Error(err.message)
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
    createGroup()
  }

  return (
    <>
      <Button variant="outline-info" onClick={() => setShow(true)}>
        <i className="fa-solid fa-plus"></i> Create a new group
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header className="bg-body-tertiary" closeButton>
          <Modal.Title>Create a new group</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <FloatingLabel label="Name" className="mb-3">
              <Form.Control
                value={nameField}
                onFocus={() => setFieldFocusCheck(false)}
                onChange={(e) => setNameField(e.target.value)}
                disabled={isLoading}
              />
            </FloatingLabel>
            <div className="special-textarea">
              <Form.Control
                as="textarea"
                rows={4}
                size="sm"
                className="position-relative"
                value={descriptionField}
                onChange={(e) => setDescriptionField(e.target.value)}
                onFocus={() => setFieldFocusCheck(true)}
                onScroll={(e) => {
                  const ref = descriptionFieldLabel.current
                  if (e.target.scrollTop === 0) {
                    ref.className = 'opacity-100'
                  } else {
                    ref.className = 'opacity-0'
                  }
                }}
                disabled={isLoading}
              />
              <label ref={descriptionFieldLabel}>
                <span>Description </span>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip>
                      This is the place where you can describe the purpose of
                      the group you are creating, as well as the community rules
                      and any other information you may find useful.
                    </Tooltip>
                  }
                >
                  <span className="pevent-all cursor-pointer">
                    <i className="bi bi-info-circle"></i>
                  </span>
                </OverlayTrigger>
              </label>
              <div className="d-flex justify-content-end">
                <EmojiMenu
                  value={fieldFocusCheck ? descriptionField : nameField}
                  setValue={
                    fieldFocusCheck ? setDescriptionField : setNameField
                  }
                  className="text-secondary mt-1"
                  align="end"
                  disabled={isLoading}
                />
              </div>
            </div>
            {errorMsg !== '' && successMsg === '' && (
              <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
            )}
            {successMsg !== '' && (
              <Form.Text className="text-success fs-8">{successMsg}</Form.Text>
            )}
            <div className="d-flex mt-3">
              <Button
                type="submit"
                variant="primary"
                className="flex-grow-1"
                disabled={isLoading || nameField.length < 3}
              >
                {isLoading ? <Spinner size="sm" /> : 'Create'}
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  )
}

export default CreateGroup
