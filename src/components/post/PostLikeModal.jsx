import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { trigger } from '../../redux/actions'

/* eslint-disable react/prop-types */
const PostLikeModal = ({ show, setShow, postLikes }) => {
  const accessToken = localStorage.getItem('accessToken')
  const myID = useSelector((state) => state.profile.id)
  const [followingList, setFollowingList] = useState([])
  const [reloadTrigger, setReloadTrigger] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
        setReloadTrigger(!reloadTrigger)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkUserFollow = (id) => {
    for (let user of followingList) {
      if (user.userID === id) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    const getFollowingData = async () => {
      try {
        const res = await fetch(
          'http://localhost:3030/api/users/me/following',
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setFollowingList(data)
        } else {
          const data = await res.json()
          throw new Error(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getFollowingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTrigger])

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false)
        dispatch(trigger())
      }}
      centered
    >
      <Modal.Body className="p-1 overflow-auto">
        <Container>
          <Row>
            {postLikes.map((user, i) => (
              <Col
                xs={12}
                key={user.id}
                className={
                  i === 0
                    ? 'd-flex align-items-center mb-2 pt-2'
                    : 'd-flex align-items-center border-top mb-2 pt-2'
                }
              >
                <div className="w-100">
                  <img
                    src={user.proPicUrl}
                    alt={user.id}
                    height={40}
                    className="rounded-circle border me-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  />
                  <button
                    type="button"
                    className="btn-clean"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    {user.username}
                  </button>
                </div>
                {myID !== user.id && (
                  <Button
                    size="sm"
                    variant={
                      checkUserFollow(user.id) ? 'outline-primary' : 'primary'
                    }
                    onClick={() => followUser(user.id)}
                  >
                    {checkUserFollow(user.id) ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </Col>
            ))}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => {
            setShow(false)
            dispatch(trigger())
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PostLikeModal
