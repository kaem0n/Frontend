/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import {
  Button,
  CloseButton,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import EmojiMenu from './EmojiMenu'

const CreatePost = ({ boardID }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [show, setShow] = useState(false)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [contentField, setContentField] = useState('')
  const inputFileRef = useRef()

  const createPost = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/posts', {
        method: 'POST',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentField, boardID: boardID }),
      })
      if (res.ok) {
        const newPost = await res.json()
        console.log(newPost)
        if (files.length > 0) {
          for (let file of files) {
            addMedia(newPost.id, file)
          }
        } else {
          resetModal()
          setShow(false)
        }
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addMedia = async (postID, file) => {
    if (file) {
      const formData = new FormData()
      formData.append('media', file)
      try {
        const res = await fetch(
          `http://localhost:3030/api/posts/${postID}/addMedia`,
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
          resetModal()
          setShow(false)
        } else {
          const data = await res.json()
          throw new Error(data.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const addFiles = (fileList) => {
    const dataTransfer = new DataTransfer()
    const arr = []

    for (let file of files) {
      dataTransfer.items.add(file)
    }

    for (let file of fileList) {
      dataTransfer.items.add(file)
    }

    for (let file of dataTransfer.files) {
      arr.push({ src: URL.createObjectURL(file), type: file.type })
      if (arr.length === dataTransfer.files.length) {
        setPreviews(arr)
        setFiles(dataTransfer.files)
        console.log(dataTransfer.files)
      }
    }
  }

  const removeFile = (index, url) => {
    const dataTransfer = new DataTransfer()

    for (let file of files) {
      dataTransfer.items.add(file)
    }
    dataTransfer.items.remove(index)

    setPreviews(previews.filter((el, i) => i !== index))
    setFiles(dataTransfer.files)
    URL.revokeObjectURL(url)
  }

  const emptyBlobStorage = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.src))
  }

  const resetModal = () => {
    emptyBlobStorage()
    setFiles([])
    setPreviews([])
    setContentField('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
  }

  return (
    <>
      {/* <button
        type="button"
        onClick={() => {
          setShow(true)
          // resetModal()
        }}
      >
        Launch demo modal
      </button> */}
      <div className="bg-body-tertiary border rounded-3 p-2 d-flex">
        <img src={user.proPicUrl} className="card-propic border me-2" />
        <button
          type="button"
          className="btn-clean border text-secondary rounded-5 bg-body flex-grow-1 text-start ps-3"
          onClick={() => {
            setShow(true)
          }}
        >
          Create a post...
        </button>
      </div>

      <Modal
        show={show}
        onHide={() => {
          setShow(false)
          resetModal()
        }}
        centered
      >
        <Modal.Header className="bg-body-tertiary">
          <h5 className="m-0 flex-grow-1 text-center">Create post</h5>
          <CloseButton
            onClick={() => {
              setShow(false)
              resetModal()
            }}
            className="position-absolute end-0 me-2"
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <textarea
              className="comment-textarea fs-4 p-0"
              placeholder="Write something..."
              rows={4}
              value={contentField}
              onChange={(e) => setContentField(e.target.value)}
            ></textarea>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Add media to your post</Tooltip>}
              >
                <button
                  type="button"
                  className="btn-media text-info px-1"
                  onClick={() => inputFileRef.current.click()}
                >
                  <span className="position-relative">
                    <i className="fa-solid fa-photo-film fs-4 me-2"></i>
                    <i className="fa-solid fa-plus plus-icon"></i>
                  </span>
                </button>
              </OverlayTrigger>
              <EmojiMenu
                value={contentField}
                setValue={setContentField}
                className="fs-4 me-2 text-secondary"
                align="end"
              />
            </div>
            <input
              type="file"
              multiple
              ref={inputFileRef}
              className="d-none"
              onChange={(e) => {
                addFiles(e.target.files)
              }}
            />
            {previews.length > 0 && (
              <div className="rounded-3 bg-body-tertiary border py-2 px-3 mb-2 d-flex flex-column">
                {previews.length + ' files added.'}
                <Container className="d-flex mt-2 px-0">
                  <Row xs={4} className="g-1">
                    {previews.map((preview, i) => (
                      <Col key={preview.src + i}>
                        <div className="position-relative rounded-3 border">
                          {preview.type.includes('image') ? (
                            <img
                              src={preview.src}
                              alt={preview.src}
                              className="w-100 rounded-3 img-sm"
                            />
                          ) : (
                            <>
                              <video
                                src={preview.src}
                                className="w-100 rounded-3 img-sm"
                              ></video>
                              <i className="fa-solid fa-play position-absolute top-50 start-50 translate-middle fs-4"></i>
                            </>
                          )}
                          <button
                            type="button"
                            className="btn-thumbnail position-absolute top-0 end-0 me-1 mt-1 border bg-body"
                            onClick={() => removeFile(i, preview.src)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Container>
              </div>
            )}
            <div className="d-flex">
              <Button type="submit" variant="primary" className="flex-grow-1">
                <i className="bi bi-send-fill"></i> Publish
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CreatePost
