/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Comment from './Comment'
import EmojiMenu from './EmojiMenu'
import { useSelector } from 'react-redux'

const CommentSection = ({ data }) => {
  const user = useSelector((state) => state.profile)
  const [inputValue, setInputValue] = useState('')
  const textarea = useRef()
  const inputFile = useRef()

  return (
    <div className="p-3 bg-body-tertiary">
      <div className="d-flex border-bottom pb-3 mb-2">
        <img src={user.proPicUrl} className="nav-propic border me-2" />
        <Form className="flex-grow-1 position-relative">
          <div className="form-control textarea-container p-0">
            <textarea
              placeholder="Write a comment..."
              className="comment-textarea hide-scrollbar"
              ref={textarea}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div
              className="px-2 d-flex justify-content-between"
              onClick={() => textarea.current.focus()}
            >
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
                      console.log(inputFile)
                    }}
                  >
                    <i className="fa-regular fa-image text-secondary"></i>
                  </button>
                </OverlayTrigger>
                <EmojiMenu
                  value={inputValue}
                  setValue={setInputValue}
                  className="text-secondary fs-5"
                />
              </div>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Send</Tooltip>}
              >
                <button className="btn-clean" disabled={inputValue === ''}>
                  <i className="bi bi-send-fill text-primary fs-5"></i>
                </button>
              </OverlayTrigger>
              <input type="file" ref={inputFile} className="d-none" />
            </div>
          </div>
        </Form>
      </div>
      <Comment data={data} />
    </div>
  )
}

export default CommentSection
