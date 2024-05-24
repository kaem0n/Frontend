/* eslint-disable react/prop-types */
import {
  Card,
  Container,
  Form,
  NavDropdown,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dateTimeFormatter from '../utils/dateTimeFormatter'
import PostMediaLayout from './post/PostMediaLayout'
import PostLike from './post/PostLike'
import CommentSection from './post/CommentSection'
import EmojiMenu from './post/EmojiMenu'

const Post = ({ data }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [postData, setPostData] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [isDeleted, setDeleted] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)
  const [contentField, setContentField] = useState('')
  const navigate = useNavigate()
  const optionsMenu = useRef()
  const textarea = useRef()

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
      const res = await fetch(`http://localhost:3030/api/posts/${data.id}`, {
        headers: {
          Authorization: accessToken,
        },
      })
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
        `http://localhost:3030/api/posts/${data.id}/like`,
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
    for (let el of data.postLikes) {
      if (user.id === el.id) return true
    }
    return false
  }

  const editPost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3030/api/posts/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentField }),
      })
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
    setContentField(data.content)
    setToggleEdit(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    editPost()
  }

  useEffect(() => {}, [postData])

  return (
    <>
      {user && data && (
        <div className={isDeleted ? 'd-none' : ''}>
          <Card className="bg-body-tertiary my-4">
            <Card.Body className="px-0 pb-0 pt-3">
              <div className="d-flex justify-content-between mb-2 px-3">
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
                    <button
                      type="button"
                      className="btn-clean menu-option p-2"
                      onClick={() => navigate(`/post/${data.id}`)}
                    >
                      <i className="fa-solid fa-up-right-from-square me-2"></i>{' '}
                      Open post page
                    </button>
                    <button
                      type="button"
                      className="btn-clean menu-option p-2"
                      onClick={() => {
                        optionsMenu.current.click()
                        setToggleEdit(true)
                        setContentField(
                          postData ? postData.content : data.content
                        )
                        setTimeout(() => {
                          textarea.current.focus()
                          textarea.current.selectionStart =
                            textarea.current.selectionEnd =
                              textarea.current.value.length
                        }, 10)
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square me-2"></i> Edit
                      post text
                    </button>
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
                              contentField === data.content ||
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
                    {postData ? postData.content : data.content}
                  </p>
                )}
                {data.mediaUrls && data.mediaUrls.length > 0 && (
                  <PostMediaLayout
                    mediaUrls={data.mediaUrls}
                    postID={data.id}
                  />
                )}
              </Container>
              <div className="px-3 mb-2">
                <div className="d-flex justify-content-between align-items-center fs-7">
                  <PostLike
                    postLikes={postData ? postData.postLikes : data.postLikes}
                  />
                  <button
                    type="button"
                    className="btn-clean underline"
                    onClick={() => {
                      setShowComments(!showComments)
                      loadData()
                    }}
                  >
                    Comments:{' '}
                    {postData ? postData.comments.length : data.comments.length}
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
                  onClick={() => {
                    setShowComments(!showComments)
                    loadData()
                  }}
                >
                  <i className="fa-regular fa-comment me-1"></i>
                  Comment
                </button>
              </div>
              <div className={showComments ? '' : 'd-none'}>
                <hr className="m-0" />
                {postData && (
                  <CommentSection data={postData} loadData={loadData} />
                )}
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </>
  )
}

export default Post
