import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
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
import ProfileNetwork from './ProfileNetwork'
import ProfileGroups from './ProfileGroups'
import ProfileBoard from './ProfileBoard'

const ProfilePage = () => {
  const accessToken = localStorage.getItem('accessToken')
  const isLoading = useSelector((state) => state.isLoading)
  const reloadTrigger = useSelector((state) => state.reloadTrigger)
  const myID = useSelector((state) => state.profile.id)
  const myFollowingList = useSelector((state) => state.following)
  const [user, setUser] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [notification, setNotification] = useState(null)
  const [timerID, setTimerID] = useState(null)
  const [showBoard, setShowBoard] = useState(true)
  const [showGroups, setShowGroups] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showProfile, setShowProfile] = useState(true)
  const [showNetwork, setShowNetwork] = useState(false)
  const [toOpen, setToOpen] = useState('')
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

  const handleClick = (e) => {
    setToOpen(`${e.target.innerText}`)
    setShowNetwork(true)
    setShowProfile(false)
  }

  const checkUserFollow = (id) => {
    for (let user of myFollowingList) {
      if (user.userID === id) {
        return true
      }
    }
    return false
  }

  const handleNotification = (msg) => {
    clearTimeout(timerID)
    const jsx = (
      <div className="position-absolute bottom-0 end-0 mx-3 mb-3 notification-fade">
        <Alert
          variant={msg.includes('Error') ? 'danger' : 'success'}
          className="m-0"
        >
          {msg.includes('Error') ? msg.slice(msg.indexOf(' ') + 1) : msg}
        </Alert>
      </div>
    )
    setNotification(jsx)
    const timer = setTimeout(() => setNotification(null), 8000)
    setTimerID(timer)
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
      setNotification(null)
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
          handleNotification(data.responseMessage)
          dispatch(endLoad())
          dispatch(trigger())
        } else {
          const data = await res.json()
          throw new Error(data.message)
        }
      } catch (error) {
        console.log(error)
        let msg = '' + error
        handleNotification(msg)
        dispatch(endLoad())
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

  const followUser = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/users/me/follow/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        dispatch(trigger())
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserData(params.userID)
    getFollowerData(params.userID)
    getFollowingData(params.userID)
    myID && params.userID !== myID
      ? navigate(`/profile/${params.userID}`)
      : navigate('/profile/me')
    setShowNetwork(false)
    setShowProfile(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userID])

  useEffect(() => {
    getFollowerData(params.userID)
    getFollowingData(params.userID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTrigger])

  return (
    user && (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
            <Container
              fluid
              id="profile-page"
              className={
                showProfile ? 'mt-5' : 'mt-5 vanish-left position-absolute'
              }
            >
              <Row className="text-center align-items-center border-bottom pb-3">
                <Col
                  xs={4}
                  md={3}
                  className="d-flex flex-column align-items-center"
                >
                  {isLoading ? (
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    followers && (
                      <button className="btn-clean" onClick={handleClick}>
                        {followers.length}
                      </button>
                    )
                  )}
                  <button
                    className="fw-semibold btn-clean"
                    onClick={handleClick}
                  >
                    Followers
                  </button>
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
                      {params.userID === 'me' && (
                        <>
                          <i
                            className="fa-solid fa-pen-to-square fs-2 propic-edit"
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
                  {myID !== user.id && (
                    <Button
                      size="sm"
                      className="mt-2"
                      variant={
                        checkUserFollow(user.id) ? 'outline-primary' : 'primary'
                      }
                      onClick={() => followUser(user.id)}
                    >
                      {checkUserFollow(user.id) ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </Col>
                <Col
                  xs={4}
                  md={3}
                  className="d-flex flex-column align-items-center"
                >
                  {isLoading ? (
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    following && (
                      <button className="btn-clean" onClick={handleClick}>
                        {following.length}
                      </button>
                    )
                  )}
                  <button
                    className="fw-semibold btn-clean"
                    onClick={handleClick}
                  >
                    Following
                  </button>
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
              <Row className="mb-3 gx-3">
                <Col xs={4} className="d-flex justify-content-center">
                  <button
                    type="button"
                    ref={btn1}
                    className="btn-special flex-grow-1 border-bottom active"
                    onClick={(e) => {
                      handleActive(e, btn2, btn3)
                      setShowBoard(true)
                      setShowGroups(false)
                      setShowInfo(false)
                    }}
                  >
                    <i className="fa-solid fa-chalkboard-user"></i> Board
                  </button>
                </Col>
                <Col xs={4} className="d-flex justify-content-center">
                  <button
                    type="button"
                    ref={btn2}
                    className="btn-special flex-grow-1 border-bottom"
                    onClick={(e) => {
                      handleActive(e, btn1, btn3)
                      setShowBoard(false)
                      setShowGroups(true)
                      setShowInfo(false)
                    }}
                  >
                    <i className="fa-solid fa-users"></i> Groups
                  </button>
                </Col>
                <Col xs={4} className="d-flex justify-content-center">
                  <button
                    type="button"
                    ref={btn3}
                    className="btn-special flex-grow-1 border-bottom"
                    onClick={(e) => {
                      handleActive(e, btn1, btn2)
                      setShowBoard(false)
                      setShowGroups(false)
                      setShowInfo(true)
                    }}
                  >
                    <i className="fa-solid fa-address-card"></i> Info
                  </button>
                </Col>
              </Row>
              <Row>
                {showBoard && (
                  <Col>
                    <ProfileBoard />
                  </Col>
                )}
                {showGroups && (
                  <Col>
                    <ProfileGroups />
                  </Col>
                )}
                {showInfo && (
                  <Col>
                    <ProfileInfo user={user} />
                  </Col>
                )}
              </Row>
            </Container>
            <ProfileNetwork
              show={showNetwork}
              setShow={setShowNetwork}
              setHide={setShowProfile}
              followers={followers}
              following={following}
              toOpen={toOpen}
              setToOpen={setToOpen}
              followUser={followUser}
            />
          </Col>
        </Row>
        {notification !== null ? notification : <></>}
      </Container>
    )
  )
}

export default ProfilePage
