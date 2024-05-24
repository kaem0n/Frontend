import { useEffect, useRef, useState } from 'react'
import {
  Card,
  Carousel,
  Col,
  Container,
  Form,
  NavDropdown,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import dateTimeFormatter from '../utils/dateTimeFormatter'
import CommentSection from './CommentSection'
import EmojiMenu from './EmojiMenu'
import PostMediaDelete from './PostMediaDelete'

const PostPage = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [postData, setPostData] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)
  const [contentField, setContentField] = useState('')
  const [showMediaDelete, setShowMediaDelete] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const optionsMenu = useRef()
  const textarea = useRef()
  const postPageCheck = useRef(true)

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

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3030/api/posts/${params.postID}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const post = await res.json()
        setPostData(post)
        setLoading(false)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const deletePost = async () => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/posts/${params.postID}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        navigate('/')
        console.log('Post successfully deleted.')
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const likePost = async () => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/posts/${params.postID}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const result = await res.json()
        console.log(result)
        loadData()
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkLikes = () => {
    for (let el of postData.postLikes) {
      if (user.id === el.id) return true
    }
    return false
  }

  const editPost = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3030/api/posts/${params.postID}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: contentField }),
        }
      )
      if (res.ok) {
        loadData()
        setToggleEdit(false)
        setLoading(false)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const discardChanges = () => {
    setContentField(postData.content)
    setToggleEdit(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    editPost()
  }

  useEffect(() => {
    setLoading(true)
    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3030/api/posts/${params.postID}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setPostData(data)
          setLoading(false)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <Row>
        <Col>
          <Card className="postpage-container bg-body-tertiary overflow-auto">
            {user && postData && (
              <Card.Body className="p-0 h-100">
                <Container fluid className="p-0 h-100">
                  <Row className="g-0 h-100">
                    <Col
                      xs={12}
                      lg={8}
                      className="bg-black d-flex flex-column justify-content-center align-items-center"
                    >
                      {postData.mediaUrls ? (
                        <>
                          <Carousel
                            className="d-flex align-items-center w-100 flex-grow-1"
                            touch
                            interval={null}
                            slide={false}
                            indicators={false}
                            prevIcon={
                              <i className="fa-solid fa-circle-chevron-left fs-2"></i>
                            }
                            nextIcon={
                              <i className="fa-solid fa-circle-chevron-right fs-2"></i>
                            }
                            defaultActiveIndex={
                              location.search
                                ? parseInt(
                                    location.search.charAt(
                                      location.search.length - 1
                                    ) - 1
                                  )
                                : 0
                            }
                          >
                            {postData.mediaUrls.map((url) => (
                              <Carousel.Item key={url}>
                                <div className="d-flex justify-content-center w-100">
                                  <img
                                    src={url}
                                    alt="post-media"
                                    className="img-carousel"
                                  />
                                </div>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                          {showMediaDelete && (
                            <PostMediaDelete
                              mediaUrls={postData.mediaUrls}
                              postID={postData.id}
                              loadData={loadData}
                              setShow={setShowMediaDelete}
                            />
                          )}
                        </>
                      ) : (
                        <h1 className="text-secondary d-none d-lg-block">
                          This post has no media.
                        </h1>
                      )}
                    </Col>
                    <Col
                      xs={12}
                      lg={4}
                      className="border-start pt-3 d-flex flex-column h-100"
                    >
                      <div className="d-flex justify-content-between mb-2 px-3">
                        <div className="d-flex align-items-center">
                          <button
                            type="button"
                            className="btn-clean me-2"
                            onClick={() =>
                              navigate(`/profile/${postData.user.id}`)
                            }
                          >
                            <img
                              src={postData.user.proPicUrl}
                              alt="profile-picture"
                              className="card-propic border"
                            />
                          </button>
                          <div className="d-flex flex-column align-items-start">
                            <button
                              type="button"
                              className="btn-clean fw-semibold underline"
                              onClick={() =>
                                navigate(`/profile/${postData.user.id}`)
                              }
                            >
                              {postData.user.username}
                            </button>
                            <p className="fs-8 text-secondary">
                              {dateTimeFormatter(
                                postData.publicationDate,
                                user.dateFormat,
                                user.timeFormat
                              )}
                            </p>
                          </div>
                        </div>
                        <NavDropdown
                          align="end"
                          ref={optionsMenu}
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
                            {postData.mediaUrls &&
                              postData.mediaUrls.length > 0 && (
                                <button
                                  type="button"
                                  className="btn-clean menu-option p-2"
                                  onClick={() => {
                                    optionsMenu.current.click()
                                    setShowMediaDelete(true)
                                  }}
                                >
                                  <i className="fa-solid fa-eraser me-2"></i>{' '}
                                  Delete media...
                                </button>
                              )}
                            <button
                              type="button"
                              className="btn-clean menu-option p-2"
                              onClick={() => {
                                optionsMenu.current.click()
                                setToggleEdit(true)
                                setContentField(postData.content)
                                setTimeout(() => {
                                  textarea.current.focus()
                                  textarea.current.selectionStart =
                                    textarea.current.selectionEnd =
                                      textarea.current.value.length
                                }, 10)
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square me-2"></i>{' '}
                              Edit post text
                            </button>
                            <button
                              type="button"
                              className="btn-clean menu-option p-2"
                              onClick={deletePost}
                            >
                              <i className="fa-solid fa-trash-can me-2"></i>{' '}
                              Delete post
                            </button>
                          </div>
                        </NavDropdown>
                      </div>
                      {toggleEdit ? (
                        <Form
                          className="pb-1 cursor-text position-relative"
                          onSubmit={handleSubmit}
                        >
                          {isLoading && (
                            <div className="position-absolute top-50 start-50 translate-middle">
                              <Spinner size="sm" />
                            </div>
                          )}
                          <textarea
                            placeholder="Write a comment..."
                            className="comment-textarea hide-scrollbar"
                            rows={
                              contentField.match(/\n/g)
                                ? contentField.match(/\n/g).length + 1
                                : 1
                            }
                            ref={textarea}
                            value={contentField}
                            onChange={(e) => setContentField(e.target.value)}
                            disabled={isLoading}
                          />
                          <div className="px-3 d-flex justify-content-between">
                            <EmojiMenu
                              value={contentField}
                              setValue={setContentField}
                              className="text-secondary fs-5"
                              disabled={isLoading}
                            />
                            <div
                              className="flex-grow-1"
                              onClick={() => textarea.current.focus()}
                            ></div>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={<Tooltip>Discard changes</Tooltip>}
                            >
                              <button
                                type="button"
                                className="btn-clean me-2"
                                onClick={discardChanges}
                                disabled={isLoading}
                              >
                                <i className="bi bi-send-slash text-info fs-5"></i>
                              </button>
                            </OverlayTrigger>
                            {
                              <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>Send</Tooltip>}
                              >
                                <button
                                  className="btn-clean"
                                  disabled={
                                    contentField.length < 3 ||
                                    contentField === postData.content ||
                                    isLoading
                                  }
                                >
                                  <i className="bi bi-send-fill text-primary fs-5"></i>
                                </button>
                              </OverlayTrigger>
                            }
                          </div>
                        </Form>
                      ) : (
                        <p className="mb-2 px-3 line-break">
                          {postData.content}
                        </p>
                      )}
                      <div className="px-3 pb-2 border-bottom">
                        <div className="d-flex justify-content-between align-items-center fs-7">
                          <button type="button" className="btn-clean underline">
                            <i className="fa-solid fa-thumbs-up me-1"></i>
                            {postData.postLikes.length}
                          </button>
                          <button
                            type="button"
                            className="btn-clean underline"
                            onClick={() => {
                              setShowComments(!showComments)
                              loadData()
                            }}
                          >
                            Comments: {postData.comments.length}
                          </button>
                        </div>
                      </div>
                      <div className="d-flex w-100 border-bottom bg-body">
                        <button
                          type="button"
                          className={
                            checkLikes()
                              ? 'btn-post ms-1 active'
                              : 'btn-post ms-1'
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
                          onClick={() => {
                            setShowComments(!showComments)
                          }}
                        >
                          <i className="fa-regular fa-comment me-1"></i>
                          Comment
                        </button>
                      </div>
                      {postData && (
                        <div className="flex-grow-1 overflow-y-auto">
                          <CommentSection
                            data={postData}
                            loadData={loadData}
                            postPageCheck={postPageCheck}
                          />
                        </div>
                      )}
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PostPage
