/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Comment from './Comment'
import EmojiMenu from './EmojiMenu'
import { useSelector } from 'react-redux'

const CommentSection = ({ data, loadData }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [contentField, setContentField] = useState('')
  const textarea = useRef()
  const inputFile = useRef()

  const createComment = async () => {
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
        console.log(newComment)
        console.log(newComment.id)
        if (inputFile.current.files[0]) {
          addImage(newComment.id)
        } else {
          setContentField('')
          loadData()
        }
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addImage = async (commentID) => {
    const file = inputFile.current.files[0]
    if (file) {
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
          const data = await res.json()
          console.log(data)
          setContentField('')
          loadData()
        } else {
          const data = await res.json()
          throw new Error(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createComment()
  }

  return (
    <div className="p-3 bg-body-tertiary">
      <div className="d-flex border-bottom pb-3 mb-2">
        <img src={user.proPicUrl} className="nav-propic border me-2" />
        <Form className="flex-grow-1 position-relative" onSubmit={handleSubmit}>
          <div className="form-control textarea-container p-0">
            <textarea
              placeholder="Write a comment..."
              className="comment-textarea hide-scrollbar"
              ref={textarea}
              value={contentField}
              onChange={(e) => setContentField(e.target.value)}
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
                  >
                    <i className="fa-regular fa-image text-secondary"></i>
                  </button>
                </OverlayTrigger>
                <EmojiMenu
                  value={contentField}
                  setValue={setContentField}
                  className="text-secondary fs-5"
                />
              </div>
              <div
                className="flex-grow-1"
                onClick={() => textarea.current.focus()}
              ></div>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Send</Tooltip>}
              >
                <button
                  className="btn-clean"
                  disabled={contentField.length < 3}
                >
                  <i className="bi bi-send-fill text-primary fs-5"></i>
                </button>
              </OverlayTrigger>
              <input type="file" ref={inputFile} className="d-none" />
            </div>
          </div>
        </Form>
      </div>
      {data.comments.length > 0 ? (
        data.comments
          .map((comment) => (
            <Comment key={comment.id} data={comment} loadData={loadData} />
          ))
          .reverse()
      ) : (
        <h4 className="text-secondary text-center mt-3">
          Comment section is empty.
        </h4>
      )}
    </div>
  )
}

export default CommentSection
