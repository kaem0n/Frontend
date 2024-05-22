/* eslint-disable react/prop-types */
import { Card, Container, NavDropdown } from 'react-bootstrap'
import CommentSection from './CommentSection'
import { useEffect, useState } from 'react'
import dateTimeFormatter from '../utils/dateTimeFormatter'
import { useSelector } from 'react-redux'
import PostMediaLayout from './PostMediaLayout'
import { useNavigate } from 'react-router-dom'

const Post = ({ data }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [postData, setPostData] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [isDeleted, setDeleted] = useState(false)
  const navigate = useNavigate()

  const handleActive = (e) => {
    if (!e.target.className.includes(' active')) {
      e.target.className += ' active'
      e.target.children[0].className = e.target.children[0].className.replace(
        'fa-regular',
        'fa-solid'
      )
      e.target.children[0].className += ' activate'
      setTimeout(() => {
        e.target.children[0].className = e.target.children[0].className.replace(
          ' activate',
          ''
        )
      }, 500)
    } else {
      e.target.className = e.target.className.replace(' active', '')
      e.target.children[0].className = e.target.children[0].className.replace(
        'fa-solid',
        'fa-regular'
      )
    }
  }

  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:3030/api/posts/${data.id}`, {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setPostData(data)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePost = async () => {
    try {
      const res = await fetch(`http://localhost:3030/api/posts/${data.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        setDeleted(true)
        console.log('Post successfully deleted.')
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const likePost = async () => {
    console.log(data)
    try {
      const res = await fetch(
        `http://localhost:3030/api/posts/${data.id}/like`,
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
        getData()
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkLikes = () => {
    for (let el of data.postLikes) {
      if (user.id === el.id) return true
    }
    return false
  }

  useEffect(() => {}, [postData])

  return (
    <>
      {user && data && (
        <div className={isDeleted ? 'd-none' : ''}>
          <Card className={'bg-body-tertiary my-4'}>
            <Card.Body className="px-0 pb-0 pt-3">
              <div className="d-flex justify-content-between align-items-center mb-2 px-3">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn-clean me-2"
                    onClick={() => navigate(`/profile/${data.user.id}`)}
                  >
                    <img
                      src={data.user.proPicUrl}
                      alt="profile-picture"
                      className="card-propic border"
                    />
                  </button>
                  <div className="d-flex flex-column align-items-start">
                    <button
                      type="button"
                      className="btn-clean fw-semibold underline"
                      onClick={() => navigate(`/profile/${data.user.id}`)}
                    >
                      {data.user.username}
                    </button>
                    <p className="fs-8 text-secondary">
                      {dateTimeFormatter(
                        data.publicationDate,
                        user.dateFormat,
                        user.timeFormat
                      )}
                    </p>
                  </div>
                </div>
                <NavDropdown
                  align="end"
                  title={
                    <button
                      type="button"
                      className="btn-clean align-self-start"
                    >
                      <i className="fa-solid fa-ellipsis"></i>
                    </button>
                  }
                >
                  <div className="p-2 d-flex flex-column fs-7">
                    <button
                      type="button"
                      className="btn-clean menu-option p-2"
                      onClick={deletePost}
                    >
                      <i className="fa-solid fa-trash-can me-2"></i> Delete post
                    </button>
                  </div>
                </NavDropdown>
              </div>
              <Container className="px-0 mb-3">
                <p className="mb-2 px-3">{data.content}</p>
                {data.mediaUrls && (
                  <PostMediaLayout mediaUrls={data.mediaUrls} />
                )}
              </Container>
              <div className="px-3 mb-2">
                <div className="d-flex justify-content-between align-items-center fs-7">
                  <button type="button" className="btn-clean underline">
                    <i className="fa-solid fa-thumbs-up me-1"></i>
                    {postData
                      ? postData.postLikes.length
                      : data.postLikes.length}
                  </button>
                  <button
                    type="button"
                    className="btn-clean underline"
                    onClick={() => setShowComments(!showComments)}
                  >
                    Comments: {data.comments.length}
                  </button>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="d-flex flex-column bg-body p-0">
              <div className="d-flex w-100">
                <button
                  type="button"
                  className={
                    checkLikes() ? 'btn-post ms-1 active' : 'btn-post ms-1'
                  }
                  onClick={(e) => {
                    handleActive(e)
                    likePost()
                  }}
                >
                  <i
                    className={
                      checkLikes()
                        ? 'fa-solid fa-thumbs-up me-1 pevent-none'
                        : 'fa-regular fa-thumbs-up me-1 pevent-none'
                    }
                  ></i>
                  Like
                </button>
                <button
                  type="button"
                  className="btn-post me-1"
                  onClick={() => setShowComments(!showComments)}
                >
                  <i className="fa-regular fa-comment me-1"></i>
                  Comment
                </button>
              </div>
              <div className={showComments ? '' : 'd-none'}>
                <hr className="m-0" />
                <CommentSection data={data} />
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </>
  )
}

export default Post
