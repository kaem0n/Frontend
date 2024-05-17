/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { endLoad, load, trigger } from '../redux/actions'

const ProfileNetwork = ({
  show,
  setShow,
  setHide,
  followers,
  following,
  toOpen,
  setToOpen,
  followUser,
}) => {
  const accessToken = localStorage.getItem('accessToken')
  const myID = useSelector((state) => state.profile.id)
  const myFollowingList = useSelector((state) => state.following)
  const [showFollowers, setShowFollowers] = useState(true)
  const [showFollowing, setShowFollowing] = useState(false)
  const btn1 = useRef()
  const btn2 = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleActive = (ref1, ref2) => {
    const current = ref1.current
    const other = ref2.current
    if (!current.className.includes(' active')) current.className += ' active'
    if (other.className.includes(' active')) {
      other.className = other.className.replace(' active', '')
    }
  }

  const checkUserFollow = (id) => {
    for (let user of myFollowingList) {
      if (user.userID === id) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    if (toOpen === 'Following') {
      handleActive(btn2, btn1)
      setShowFollowers(false)
      setShowFollowing(true)
    } else if (toOpen === 'Followers') {
      handleActive(btn1, btn2)
      setShowFollowers(true)
      setShowFollowing(false)
    }
  }, [toOpen])

  return (
    <Container
      fluid
      id="profile-network"
      className={
        show ? 'vanish-right vh-85 d-flex flex-column' : 'position-absolute'
      }
    >
      <Row>
        <Col className="d-flex">
          <button
            type="button"
            className="btn-special flex-grow-1 border-bottom active"
            ref={btn1}
            onClick={(e) => {
              handleActive(btn1, btn2)
              setShowFollowers(true)
              setShowFollowing(false)
              setToOpen(e.target.innerText)
            }}
          >
            Followers: {followers.length}
          </button>
        </Col>
        <Col className="d-flex">
          <button
            type="button"
            className="btn-special flex-grow-1 border-bottom"
            ref={btn2}
            onClick={(e) => {
              handleActive(btn2, btn1)
              setShowFollowers(false)
              setShowFollowing(true)
              setToOpen(e.target.innerText)
            }}
          >
            Following: {following.length}
          </button>
        </Col>
      </Row>
      {showFollowers && (
        <Row className="my-3 g-2 flex-grow-1 align-content-start overflow-y-auto hide-scrollbar">
          {followers.length > 0 ? (
            followers.map((user) => (
              <Col
                xs={12}
                key={user.userID}
                className="d-flex align-items-center border-bottom pb-2"
              >
                <div className="w-100">
                  <img
                    src={user.proPicUrl}
                    alt={user.userID}
                    height={40}
                    className="rounded-circle border me-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${user.userID}`)}
                  />
                  <button
                    type="button"
                    className="btn-clean"
                    onClick={() => navigate(`/profile/${user.userID}`)}
                  >
                    {user.username}
                  </button>
                </div>
                {myID !== user.userID && (
                  <Button
                    size="sm"
                    variant={
                      checkUserFollow(user.userID)
                        ? 'outline-primary'
                        : 'primary'
                    }
                    onClick={() => followUser(user.userID)}
                  >
                    {checkUserFollow(user.userID) ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </Col>
            ))
          ) : (
            <h4 className="text-secondary text-center">
              You don&apos;t have any followers
            </h4>
          )}
        </Row>
      )}
      {showFollowing && (
        <Row className="my-3 g-2 flex-grow-1 align-content-start">
          {following.length > 0 ? (
            following.map((user) => (
              <Col
                xs={12}
                key={user.userID}
                className="d-flex align-items-center border-bottom pb-2"
              >
                <div className="w-100">
                  <img
                    src={user.proPicUrl}
                    alt={user.userID}
                    height={40}
                    className="rounded-circle border me-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${user.userID}`)}
                  />
                  <button
                    type="button"
                    className="btn-clean"
                    onClick={() => navigate(`/profile/${user.userID}`)}
                  >
                    {user.username}
                  </button>
                </div>
                {myID !== user.userID && (
                  <Button
                    size="sm"
                    variant={
                      checkUserFollow(user.userID)
                        ? 'outline-primary'
                        : 'primary'
                    }
                    onClick={() => followUser(user.userID)}
                  >
                    {checkUserFollow(user.userID) ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </Col>
            ))
          ) : (
            <h4 className="text-secondary text-center">
              You don&apos;t follow anyone
            </h4>
          )}
        </Row>
      )}
      <hr />
      <Row className="mt-3 text-end">
        <Col>
          <Button
            size="sm"
            variant="outline-info"
            onClick={() => {
              setShow(false)
              setHide(true)
            }}
          >
            Go back
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default ProfileNetwork
