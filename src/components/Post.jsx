import { Card, Col, Container, Row } from 'react-bootstrap'
import dateFormatter from '../utils/dateFormatter'

const Post = () => {
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
    <Card className="bg-body-tertiary">
      <Card.Body className="px-0 pb-0 pt-3">
        <div className="d-flex align-items-center mb-2 px-3">
          {/* POST INFO */}
          <img
            src="https://res.cloudinary.com/kaem0n/image/upload/v1714550501/default_user_icon_nm5w0s.png"
            className="nav-propic border me-2"
          />
          <div className="d-flex flex-column">
            <p className="fw-semibold underline cursor-pointer">username</p>
            <p className="fs-8 text-secondary">
              {dateFormatter(new Date('2023-05-03'), 'DMY')} · 18:39
            </p>
          </div>
        </div>
        <Container className="px-0">
          {/* CONTENT */}
          <p className="mb-2 px-3">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur
            consectetur natus velit necessitatibus rem culpa eaque, asperiores,
            voluptatem excepturi veniam assumenda ipsum consequuntur soluta
            quibusdam temporibus saepe molestias dolorum! Illo?
          </p>
          <Row className="g-0 justify-content-center align-items-center mb-2">
            {/* MEDIA */}
            <Col xs={6} className="d-flex flex-column">
              <img
                src="https://placebear.com/500/300"
                alt="test"
                className="img-sm"
              />
              <img
                src="https://placedog.net/400/700"
                alt="test"
                className="img-sm"
              />
            </Col>
            <Col xs={6}>
              <img
                src="https://placedog.net/900/900"
                alt="test"
                className="img-lg"
              />
            </Col>
          </Row>
        </Container>
        <div className="px-3 mb-2">
          {/* LIKE BUTTON + NUMBER OF COMMENTS */}
          <div className="d-flex justify-content-between align-items-center fs-7">
            <button type="button" className="btn-clean underline">
              <i className="fa-solid fa-thumbs-up me-1"></i>
              99
            </button>
            <button type="button" className="btn-clean underline">
              Comments: 12
            </button>
          </div>
        </div>
        {/* <hr className="mb-0" /> */}
      </Card.Body>
      <Card.Footer className="d-flex bg-body p-0">
        <button type="button" className="btn-post ms-1" onClick={handleActive}>
          <i className="fa-regular fa-thumbs-up me-1 pevent-none"></i>
          Like
        </button>
        <button type="button" className="btn-post me-1">
          <i className="fa-regular fa-comment me-1"></i>
          Comment
        </button>
      </Card.Footer>
    </Card>
  )
}

export default Post
