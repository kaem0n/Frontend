/* eslint-disable react/prop-types */
import { Card, Col, Container, Row } from 'react-bootstrap'
import dateFormatter from '../utils/dateFormatter'
import CommentSection from './CommentSection'
import { useState } from 'react'
import dateTimeFormatter from '../utils/dateTimeFormatter'
import { useSelector } from 'react-redux'
import PostMediaLayout from './PostMediaLayout'
import { useNavigate } from 'react-router-dom'

const Post = ({ data }) => {
  const user = useSelector((state) => state.profile)
  const [showComments, setShowComments] = useState(false)
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

  return (
    <>
      {user && data && (
        <Card className="bg-body-tertiary my-4">
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
              <button type="button" className="btn-clean align-self-start">
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </div>
            <Container className="px-0 mb-3">
              <p className="mb-2 px-3">{data.content}</p>
              {data.mediaUrls && <PostMediaLayout mediaUrls={data.mediaUrls} />}
            </Container>
            <div className="px-3 mb-2">
              <div className="d-flex justify-content-between align-items-center fs-7">
                <button type="button" className="btn-clean underline">
                  <i className="fa-solid fa-thumbs-up me-1"></i>
                  {data.postLikes.length}
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
                className="btn-post ms-1"
                onClick={handleActive}
              >
                <i className="fa-regular fa-thumbs-up me-1 pevent-none"></i>
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
      )}
    </>
  )
}

export default Post
