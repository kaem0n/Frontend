/* eslint-disable react/prop-types */
import {
  Col,
  Container,
  Form,
  NavDropdown,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import dateTimeFormatter from '../../utils/dateTimeFormatter'
import EmojiMenu from './EmojiMenu'

const Comment = ({ data, loadData }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [isLoading, setLoading] = useState(false)
  const [toggleEdit, setToggleEdit] = useState(false)
  const [contentField, setContentField] = useState(data.content)
  const [preview, setPreview] = useState('')
  const optionsMenu = useRef()
  const textarea = useRef()
  const inputFile = useRef()
  const navigate = useNavigate()

  const deleteComment = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3030/api/comments/${data.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        console.log('Comment deleted successfully.')
        loadData()
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

  const addImage = async () => {
    const file = inputFile.current.files[0]
    if (file) {
      setLoading(true)
      try {
        const formData = new FormData()
        formData.append('image', file)
        const res = await fetch(
          `http://localhost:3030/api/comments/${data.id}/addImage`,
          {
            method: 'PATCH',
            headers: {
              Authorization: accessToken,
            },
            body: formData,
          }
        )
        if (res.ok) {
          const editedComment = await res.json()
          console.log(editedComment)
          setToggleEdit(false)
          loadData()
          removePreview()
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
  }

  const removeImage = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3030/api/comments/${data.id}/removeImage`,
        {
          method: 'PATCH',
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const editedComment = await res.json()
        console.log(editedComment)
        setToggleEdit(false)
        loadData()
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

  const loadPreview = () => {
    const file = inputFile.current.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const removePreview = () => {
    URL.revokeObjectURL(preview)
    setPreview('')
    inputFile.current.files = new DataTransfer().files
  }

  const editComment = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3030/api/comments/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentField }),
      })
      if (res.ok) {
        const editedComment = await res.json()
        console.log(editedComment)
        if (inputFile.current.files[0]) {
          addImage()
        } else {
          setToggleEdit(false)
          loadData()
          setLoading(false)
        }
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const likeComment = async () => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/comments/${data.id}/like`,
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
    for (let el of data.commentLikes) {
      if (user.id === el.id) return true
    }
    return false
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    editComment()
  }

  return (
    <div className="d-flex flex-column my-3">
      <div className="d-flex justify-content-between">
        <div className="d-flex mb-2 align-items-center">
          <button
            type="button"
            className="btn-clean me-2"
            onClick={() => navigate(`/profile/${data.user.id}`)}
          >
            <img src={data.user.proPicUrl} className="nav-propic border" />
          </button>
          <div>
            <button
              type="button"
              className="btn-clean fw-semibold underline fs-7"
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
            <button type="button" className="btn-clean align-self-start">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          }
        >
          <div className="p-2 d-flex flex-column fs-7">
            {data.imageUrl && (
              <button
                type="button"
                className="btn-clean menu-option px-2 py-1"
                onClick={() => {
                  optionsMenu.current.click()
                  removeImage()
                }}
              >
                <i className="fa-solid fa-eraser me-2"></i> Remove image
              </button>
            )}
            <button
              type="button"
              className="btn-clean menu-option px-2 py-1"
              onClick={() => {
                optionsMenu.current.click()
                setToggleEdit(true)
                setTimeout(() => {
                  textarea.current.focus()
                  textarea.current.selectionStart =
                    textarea.current.selectionEnd =
                      textarea.current.value.length
                }, 10)
              }}
            >
              <i className="fa-solid fa-pen-to-square me-2"></i> Edit comment
            </button>
            <button
              type="button"
              className="btn-clean menu-option px-2 py-1"
              onClick={deleteComment}
            >
              <i className="fa-solid fa-trash-can me-2"></i> Delete comment
            </button>
          </div>
        </NavDropdown>
      </div>
      <div>
        <div className="bg-body comment-container textarea-container mb-1 position-relative">
          {isLoading && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <Spinner size="sm" />
            </div>
          )}
          {toggleEdit ? (
            <>
              <Form className="pb-1 cursor-text" onSubmit={handleSubmit}>
                <textarea
                  placeholder="Write a comment..."
                  className="comment-textarea hide-scrollbar fs-7"
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
                  <div className="d-flex align-items-center">
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Upload an image</Tooltip>}
                    >
                      <button
                        type="button"
                        className="btn-clean me-2 fs-5"
                        onClick={() => {
                          inputFile.current.click()
                        }}
                        disabled={isLoading}
                      >
                        <i className="fa-regular fa-image text-secondary"></i>
                      </button>
                    </OverlayTrigger>
                    <EmojiMenu
                      value={contentField}
                      setValue={setContentField}
                      className="text-secondary fs-5"
                      disabled={isLoading}
                    />
                  </div>
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
                      onClick={() => {
                        setToggleEdit(false)
                        removePreview()
                        setContentField(data.content)
                      }}
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
                <input
                  type="file"
                  ref={inputFile}
                  className="d-none"
                  onChange={loadPreview}
                />
              </Form>
              {preview !== '' && (
                <Container className="d-flex mx-2 mb-2 px-0">
                  <Row className="g-1">
                    <Col xs={2}>
                      <div className="position-relative rounded-3 border">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-100 rounded-3 img-sm"
                        />
                        <button
                          type="button"
                          className="btn-thumbnail position-absolute top-0 end-0 me-1 mt-1 border bg-body"
                          onClick={removePreview}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Container>
              )}
            </>
          ) : (
            <p className="pb-2 pt-1 px-3 fs-7 line-break">{data.content}</p>
          )}
          {data.imageUrl && !toggleEdit && (
            <img
              src={data.imageUrl}
              alt="comment-image"
              className="comment-img"
            />
          )}
        </div>
        <div className="fs-7 px-3">
          <button
            type="button"
            className={
              checkLikes()
                ? 'btn-clean underline text-primary'
                : 'btn-clean underline'
            }
          >
            <i className="fa-solid fa-thumbs-up me-1"></i>
            {data.commentLikes.length}
          </button>
          <span className="mx-1">·</span>
          <button
            type="button"
            className={
              checkLikes()
                ? 'btn-clean underline text-primary fw-semibold'
                : 'btn-clean underline'
            }
            onClick={likeComment}
          >
            Like
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comment
