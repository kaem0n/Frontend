import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Col,
  Container,
  Placeholder,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad, load, trigger } from '../redux/actions'
import ProfileInfo from './ProfileInfo'
import { useNavigate, useParams } from 'react-router-dom'

const ProfilePage = () => {
  const accessToken = localStorage.getItem('accessToken')
  const isLoading = useSelector((state) => state.isLoading)
  const [user, setUser] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [responseMsg, setResponseMsg] = useState('')
  const [showBoard, setShowBoard] = useState(true)
  const [showNetwork, setShowNetwork] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const imageInputRef = useRef()
  const btn1 = useRef()
  const btn2 = useRef()
  const btn3 = useRef()

  const handleActive = (event, ref1, ref2) => {
    const current = event.target
    const other1 = ref1.current
    const other2 = ref2.current
    if (!current.className.includes(' active')) current.className += ' active'
    if (other1.className.includes(' active')) {
      other1.className = other1.className.replace(' active', '')
    }
    if (other2.className.includes(' active')) {
      other2.className = other2.className.replace(' active', '')
    }
  }

  const getUserData = async (param) => {
    try {
      const res = await fetch(`http://localhost:3030/api/users/${param}`, {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        setUser(data)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const proPicUpload = async () => {
    const file = imageInputRef.current.files[0]
    if (file) {
      dispatch(load())
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await fetch(
          'http://localhost:3030/api/users/me/changeProPic',
          {
            method: 'PATCH',
            headers: {
              Authorization: accessToken,
            },
            body: formData,
          }
        )
        if (res.ok) {
          const data = await res.json()
          setResponseMsg(data.responseMessage)
          dispatch(endLoad())
          dispatch(trigger())
          setTimeout(() => setResponseMsg(''), 8000)
        } else {
          const data = await res.json()
          throw new Error(data.message)
        }
      } catch (error) {
        console.log(error)
        let msg = '' + error
        setResponseMsg(msg)
        dispatch(endLoad())
        setTimeout(() => setResponseMsg(''), 8000)
      }
    }
  }

  const getFollowingData = async (param) => {
    dispatch(load())
    try {
      const res = await fetch(
        `http://localhost:3030/api/users/${param}/following`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setFollowing(data)
        dispatch(endLoad())
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      dispatch(endLoad())
    }
  }

  const getFollowerData = async (param) => {
    dispatch(load())
    try {
      const res = await fetch(
        `http://localhost:3030/api/users/${param}/followedBy`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setFollowers(data)
        dispatch(endLoad())
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      dispatch(endLoad())
    }
  }

  useEffect(() => {
    getUserData(params.userId)
    getFollowerData(params.userId)
    getFollowingData(params.userId)
    navigate(`/profile/${params.userId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId])

  return (
    user && (
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Container fluid>
              <Row className="text-center align-items-center border-bottom pb-3">
                <Col xs={4} md={3}>
                  {isLoading ? (
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    followers && <p>{followers.length}</p>
                  )}
                  <p className="fw-semibold">Followers</p>
                </Col>
                <Col xs={4} md={6}>
                  {isLoading ? (
                    <div className="my-5 d-flex justify-content-center align-items-center">
                      <Spinner animation="grow" />
                    </div>
                  ) : (
                    <div className="position-relative">
                      <img
                        src={user.proPicUrl}
                        alt="profile-picture"
                        className="propic border"
                      />
                      {params.userId === 'me' && (
                        <>
                          <i
                            className="fa-solid fa-pen-to-square fs-2 propic-icon"
                            onClick={() => imageInputRef.current.click()}
                          ></i>
                          <input
                            type="file"
                            className="d-none"
                            ref={imageInputRef}
                            onChange={proPicUpload}
                          />
                        </>
                      )}
                    </div>
                  )}
                  <p className="profile-username">{user.username}</p>
                </Col>
                <Col xs={4} md={3}>
                  {isLoading ? (
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    following && <p>{following.length}</p>
                  )}
                  <p className="fw-semibold">Following</p>
                </Col>
                <Col xs={12} className="text-start mt-3">
                  {user.name && (
                    <p className="fw-semibold mb-1">
                      {user.name} {user.surname ? user.surname : ''}
                    </p>
                  )}
                  {user.bio && <p className="line-break fs-7">{user.bio}</p>}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col className="d-flex">
                  <button
                    type="button"
                    ref={btn1}
                    className="btn-special flex-grow-1 border-bottom active"
                    onClick={(e) => {
                      handleActive(e, btn2, btn3)
                      setShowBoard(true)
                      setShowNetwork(false)
                      setShowInfo(false)
                    }}
                  >
                    Board
                  </button>
                </Col>
                <Col className="d-flex">
                  <button
                    type="button"
                    ref={btn2}
                    className="btn-special flex-grow-1 border-bottom"
                    onClick={(e) => {
                      handleActive(e, btn1, btn3)
                      setShowBoard(false)
                      setShowNetwork(true)
                      setShowInfo(false)
                    }}
                  >
                    Network
                  </button>
                </Col>
                <Col className="d-flex">
                  <button
                    type="button"
                    ref={btn3}
                    className="btn-special flex-grow-1 border-bottom"
                    onClick={(e) => {
                      handleActive(e, btn1, btn2)
                      setShowBoard(false)
                      setShowNetwork(false)
                      setShowInfo(true)
                    }}
                  >
                    Info
                  </button>
                </Col>
              </Row>
              <Row>
                <Col>{showInfo && <ProfileInfo user={user} />}</Col>
              </Row>
            </Container>
          </Col>
        </Row>
        {responseMsg !== '' && (
          <div className="position-absolute bottom-0 end-0 mx-3 mb-3 notification-fade">
            <Alert
              variant={responseMsg.includes('Error') ? 'danger' : 'success'}
              className="m-0"
            >
              {responseMsg.includes('Error')
                ? responseMsg.slice(responseMsg.indexOf(' ') + 1)
                : responseMsg}
            </Alert>
          </div>
        )}
      </Container>
    )
  )
}

export default ProfilePage
