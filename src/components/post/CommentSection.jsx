/* eslint-disable react/prop-types */
import {
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Comment from './Comment'
import EmojiMenu from './EmojiMenu'

const CommentSection = ({
  data,
  loadData,
  postPageCheck = false,
  disabled,
}) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [isLoading, setLoading] = useState(false)
  const [contentField, setContentField] = useState('')
  const [preview, setPreview] = useState('')
  const textarea = useRef()
  const inputFile = useRef()
  const counter = useRef(4)
  const navigate = useNavigate()

  const createComment = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3030/api/comments', {
        method: 'POST',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentField, postID: data.id }),
      })
      if (res.ok) {
        const newComment = await res.json()
        if (inputFile.current.files[0]) {
          addImage(newComment.id)
        } else {
          setContentField('')
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

  const addImage = async (commentID) => {
    const file = inputFile.current.files[0]
    if (file) {
      setLoading(true)
      try {
        const formData = new FormData()
        formData.append('image', file)
        const res = await fetch(
          `http://localhost:3030/api/comments/${commentID}/addImage`,
          {
            method: 'PATCH',
            headers: {
              Authorization: accessToken,
            },
            body: formData,
          }
        )
        if (res.ok) {
          removePreview()
          setContentField('')
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
  }

  const printComments = () => {
    return data.comments
      .sort(
        (comment1, comment2) =>
          new Date(comment1.publicationDate) -
          new Date(comment2.publicationDate)
      )
      .filter((comment, i) => i < counter.current)
      .map((comment) => (
        <Comment
          key={comment.id}
          data={comment}
          loadData={loadData}
          disabled={disabled}
        />
      ))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    createComment()
    setPreview('')
  }

  useEffect(() => {}, [data])

  return (
    <div className={postPageCheck ? '' : 'p-1'}>
      <div
        className={
          postPageCheck
            ? 'px-3 pt-3 bg-body-tertiary rounded-bottom-2 d-flex flex-column'
            : 'px-3 pb-3 bg-body-tertiary rounded-bottom-2 d-flex flex-column'
        }
      >
        {data.comments.length > 0 ? (
          <div className={postPageCheck ? 'order-2' : ''}>
            {printComments()}
            {data.comments.length > counter.current && (
              <div className="d-flex justify-content-center">
                <button
                  className={
                    postPageCheck
                      ? 'btn-clean text-center pb-3 underline'
                      : 'btn-clean text-center pb-2 underline'
                  }
                  onClick={() => {
                    counter.current += 4
                    loadData()
                  }}
                >
                  Load more ({data.comments.length - counter.current} remaining)
                </button>
              </div>
            )}
          </div>
        ) : (
          <h4
            className={
              postPageCheck
                ? 'text-secondary text-center mb-3'
                : 'text-secondary text-center my-3'
            }
          >
            Comment section is empty.
          </h4>
        )}
        <div
          className={
            postPageCheck
              ? 'd-flex border-bottom pb-3 order-1'
              : 'd-flex border-top pt-3'
          }
        >
          {!postPageCheck && (
            <img
              src={user.proPicUrl}
              className="nav-propic border me-2 cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            />
          )}
          <Form
            className="flex-grow-1 position-relative"
            onSubmit={handleSubmit}
          >
            {isLoading && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <Spinner size="sm" />
              </div>
            )}
            <div className="form-control textarea-container p-0">
              <textarea
                placeholder="Write a comment..."
                className="comment-textarea hide-scrollbar"
                ref={textarea}
                value={contentField}
                onChange={(e) => setContentField(e.target.value)}
                rows={
                  contentField.match(/\n/g)
                    ? contentField.match(/\n/g).length + 1
                    : 2
                }
                disabled={isLoading || disabled}
              />
              <div className="px-2 d-flex justify-content-between">
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
                      disabled={isLoading || disabled}
                    >
                      <i className="fa-regular fa-image text-secondary"></i>
                    </button>
                  </OverlayTrigger>
                  <EmojiMenu
                    value={contentField}
                    setValue={setContentField}
                    className="text-secondary fs-5"
                    disabled={isLoading || disabled}
                  />
                </div>
                <div
                  className="flex-grow-1 cursor-text"
                  onClick={() => textarea.current.focus()}
                ></div>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Send</Tooltip>}
                >
                  <button
                    className="btn-clean"
                    disabled={contentField.length < 3 || isLoading || disabled}
                  >
                    <i className="bi bi-send-fill text-primary fs-5"></i>
                  </button>
                </OverlayTrigger>
                <input
                  type="file"
                  ref={inputFile}
                  className="d-none"
                  onChange={loadPreview}
                />
              </div>
              {preview !== '' && (
                <Container className="d-flex mx-2 mb-2 mt-1 px-0">
                  <Row className="g-1">
                    <Col xs={3}>
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
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default CommentSection
