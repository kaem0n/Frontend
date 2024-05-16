/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  FloatingLabel,
  Badge,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad, load, trigger } from '../../redux/actions'

const UpdateInfo = ({ showSetting, setShowSetting, setShowMenu }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const isLoading = useSelector((state) => state.isLoading)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [nameField, setNameField] = useState('')
  const [surnameField, setSurnameField] = useState('')
  const [birthdayField, setBirthdayField] = useState('')
  const [genderField, setGenderField] = useState('')
  const [occupationField, setOccupationField] = useState('')
  const [hobbiesField, setHobbiesField] = useState([])
  const [bioField, setBioField] = useState('')
  const bioFieldLabel = useRef()
  const dispatch = useDispatch()

  const updateInfo = async () => {
    setErrorMsg('')
    dispatch(load())
    try {
      const res = await fetch('http://localhost:3030/api/users/me', {
        method: 'PUT',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameField,
          surname: surnameField,
          birthday: birthdayField === '' ? null : birthdayField,
          gender: genderField,
          occupation: occupationField,
          hobbies: hobbiesField,
          bio: bioField,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        setSuccessMsg('Account info successfully updated!')
        setTimeout(() => {
          dispatch(trigger())
          setShowSetting(false)
          setShowMenu(true)
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
    updateInfo()
    console.log(e)
  }

  const addHobby = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (e.key === 'Enter' && e.target.value) {
      setHobbiesField([...hobbiesField, e.target.value])
      e.target.value = ''
      console.log(e.target.value)
    }
  }

  const removeHobby = (str) => {
    const filtered = hobbiesField.filter(
      (el, i) => i !== hobbiesField.indexOf(str)
    )
    setHobbiesField(filtered)
  }

  const updateFields = () => {
    setNameField(user.name === null ? '' : user.name)
    setSurnameField(user.surname === null ? '' : user.surname)
    setBirthdayField(user.birthday === null ? '' : user.birthday)
    setGenderField(user.gender)
    setOccupationField(user.occupation === null ? '' : user.occupation)
    setHobbiesField(user.hobbies === null ? [] : user.hobbies)
    setBioField(user.bio === null ? '' : user.bio)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateFields(), [user])

  return (
    <Container
      id="change-password"
      className={showSetting ? 'vanish-right' : 'position-absolute'}
    >
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <div className="mb-2 d-flex">
              <FloatingLabel label="Name" className="me-2 flex-grow-1">
                <Form.Control
                  size="sm"
                  maxLength={50}
                  value={nameField}
                  onChange={(e) => {
                    setNameField(e.target.value)
                  }}
                />
              </FloatingLabel>
              {errorMsg !== '' && errorMsg.includes('Name') && (
                <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
              )}
              <FloatingLabel label="Surname" className="flex-grow-1">
                <Form.Control
                  size="sm"
                  maxLength={50}
                  value={surnameField}
                  onChange={(e) => {
                    setSurnameField(e.target.value)
                  }}
                  disabled={nameField ? false : true}
                />
              </FloatingLabel>
              {errorMsg !== '' && errorMsg.includes('Surname') && (
                <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
              )}
            </div>
            <div className="mb-2 d-flex align-items-center">
              <FloatingLabel label="Birthday" className="me-2 flex-grow-1">
                <Form.Control
                  type="date"
                  size="sm"
                  min="1920-01-01"
                  max={new Date().getFullYear() - 16 + '-12-31'}
                  value={birthdayField}
                  onChange={(e) => setBirthdayField(e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="Gender">
                <Form.Select
                  size="sm"
                  value={genderField}
                  onChange={(e) => setGenderField(e.target.value)}
                >
                  <option value="UNDEFINED">Not specified</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Form.Select>
              </FloatingLabel>
            </div>
            <div className="mb-2">
              <FloatingLabel label="Occupation">
                <Form.Control
                  size="sm"
                  maxLength={30}
                  value={occupationField}
                  onChange={(e) => setOccupationField(e.target.value)}
                />
              </FloatingLabel>
              {errorMsg !== '' && errorMsg.includes('Occupation') && (
                <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
              )}
            </div>
            <div className="mb-2">
              <div className="mb-1">
                <FloatingLabel label="Hobbies">
                  <Form.Control
                    as="textarea"
                    size="sm"
                    maxLength={20}
                    onKeyDown={addHobby}
                    className="textarea-resize-none"
                    minLength={3}
                  />
                </FloatingLabel>
                {errorMsg !== '' && errorMsg.includes('Hobby') && (
                  <Form.Text className="text-danger fs-8">{errorMsg}</Form.Text>
                )}
              </div>
              {hobbiesField.length !== 0 && (
                <div>
                  {hobbiesField.map((hobby, i) => (
                    <Badge pill key={hobby + i} bg="info" className="me-1">
                      <span className="me-1">{hobby}</span>
                      <button
                        type="button"
                        className="btn-clean"
                        onClick={() => removeHobby(hobby)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-2">
              <div className="special-textarea">
                <Form.Control
                  as="textarea"
                  rows={4}
                  size="sm"
                  className="position-relative"
                  value={bioField}
                  onChange={(e) => setBioField(e.target.value)}
                  onScroll={(e) => {
                    const ref = bioFieldLabel.current
                    if (e.target.scrollTop === 0) {
                      ref.className = 'opacity-100'
                    } else {
                      ref.className = 'opacity-0'
                    }
                  }}
                />
                {successMsg !== '' && (
                  <Form.Text className="text-success fs-8">
                    {successMsg}
                  </Form.Text>
                )}
                <label ref={bioFieldLabel}>About me...</label>
              </div>
            </div>
            <div className="text-end">
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-1"
                onClick={() => {
                  setShowMenu(true)
                  setShowSetting(false)
                  setErrorMsg('')
                  updateFields()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading ? true : false}
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

export default UpdateInfo
