/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Button,
  Carousel,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'

const PostMediaDelete = ({ mediaUrls, postID, loadData, setShow }) => {
  const accessToken = localStorage.getItem('accessToken')
  const [toDelete, setToDelete] = useState([])
  const [isLoading, setLoading] = useState(false)

  const handleDeleteList = (e, url) => {
    if (e.target.className.includes(' selected')) {
      e.target.className = e.target.className.replace(' selected', '')
      setToDelete([...toDelete.filter((el) => el !== url)])
    } else {
      e.target.className += ' selected'
      setToDelete([...toDelete, url])
    }
  }

  const handleDeleteItems = () => {
    if (mediaUrls.length < 5) {
      return (
        <Carousel.Item>
          <Container>
            <Row xs={5}>
              {mediaUrls.map((url) => (
                <Col key={url}>
                  <button className="btn-clean" disabled={isLoading}>
                    <img
                      src={url}
                      alt="media-delete-item"
                      className="img-sm item"
                      onClick={(e) => handleDeleteList(e, url)}
                    />
                  </button>
                </Col>
              ))}
            </Row>
          </Container>
        </Carousel.Item>
      )
    } else {
      const items = []
      let breakpoint = 5
      let item = []
      for (let i = 0; i < mediaUrls.length; i++) {
        item.push(mediaUrls[i])
        if (i === mediaUrls.length - 1) items.push(item)
        else if (i === breakpoint - 1) {
          items.push(item)
          item = []
          breakpoint += 5
        }
      }
      return items.map((item) => (
        <Carousel.Item key={item}>
          <Container>
            <Row xs={5} className="gx-3">
              {item.map((url) => (
                <Col key={url}>
                  <button className="btn-clean" disabled={isLoading}>
                    <img
                      src={url}
                      alt="media-delete-item"
                      className="img-sm item"
                      onClick={(e) => handleDeleteList(e, url)}
                    />
                  </button>
                </Col>
              ))}
            </Row>
          </Container>
        </Carousel.Item>
      ))
    }
  }

  const deleteMedia = async () => {
    setLoading(true)
    for (let i = 0; i < toDelete.length; i++) {
      const url = toDelete[i]
      const mediaID = url.substring(
        url.lastIndexOf('/') + 1,
        url.lastIndexOf('.')
      )
      try {
        const res = await fetch(
          `http://localhost:3030/api/posts/${postID}/removeMedia/${mediaID}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          if (i === toDelete.length - 1) {
            loadData()
            setLoading(false)
            setShow(false)
          }
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
        break
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    deleteMedia()
  }

  return (
    <div className="position-relative">
      <Carousel
        className="d-flex align-items-center w-100 py-2 px-5 border-top"
        touch
        interval={null}
        slide={false}
        indicators={false}
      >
        {handleDeleteItems()}
      </Carousel>
      <Form
        className="px-3 pb-2 text-white d-flex justify-content-between align-items-center"
        onSubmit={handleSubmit}
      >
        <p>{toDelete.length} items selected for deletion.</p>
        <div>
          <Button
            variant="outline-info"
            size="sm"
            className="me-2"
            onClick={() => {
              setShow(false)
            }}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="outline-danger"
            size="sm"
            disabled={toDelete.length === 0 || isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : 'Confirm'}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PostMediaDelete
