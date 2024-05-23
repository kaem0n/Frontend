/* eslint-disable react/prop-types */
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const PostMediaLayout = ({ mediaUrls, postID }) => {
  return (
    <Row className="g-0 justify-content-center align-items-center">
      {mediaUrls.length === 1 ? (
        <Col xs={12}>
          <Link to={`/post/${postID}`}>
            <img src={mediaUrls[0]} alt={mediaUrls[0]} className="img-sm" />
          </Link>
        </Col>
      ) : mediaUrls.length === 2 ? (
        <>
          <Col xs={6}>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[0]} alt={mediaUrls[0]} className="img-lg" />
            </Link>
          </Col>
          <Col xs={6}>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[1]} alt={mediaUrls[1]} className="img-lg" />
            </Link>
          </Col>
        </>
      ) : mediaUrls.length === 3 ? (
        <>
          <Col xs={6} className="d-flex flex-column">
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[0]} alt={mediaUrls[0]} className="img-sm" />
            </Link>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[1]} alt={mediaUrls[1]} className="img-sm" />
            </Link>
          </Col>
          <Col xs={6}>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[2]} alt={mediaUrls[2]} className="img-lg" />
            </Link>
          </Col>
        </>
      ) : mediaUrls.length === 4 ? (
        <>
          <Col xs={6} className="d-flex flex-column">
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[0]} alt={mediaUrls[0]} className="img-sm" />
            </Link>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[1]} alt={mediaUrls[1]} className="img-sm" />
            </Link>
          </Col>
          <Col xs={6} className="d-flex flex-column">
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[2]} alt={mediaUrls[2]} className="img-sm" />
            </Link>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[3]} alt={mediaUrls[3]} className="img-sm" />
            </Link>
          </Col>
        </>
      ) : (
        <>
          <Col xs={6} className="d-flex flex-column">
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[0]} alt={mediaUrls[0]} className="img-sm" />
            </Link>
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[1]} alt={mediaUrls[1]} className="img-sm" />
            </Link>
          </Col>
          <Col xs={6} className="d-flex flex-column">
            <Link to={`/post/${postID}`}>
              <img src={mediaUrls[2]} alt={mediaUrls[2]} className="img-sm" />
            </Link>
            <div
              className="img-sm mask fs-1 fw-semibold d-flex justify-content-center align-items-center"
              style={{
                backgroundImage: `url(${mediaUrls[3]})`,
              }}
            >
              <span className="pevent-none">+{mediaUrls.length - 4}</span>
            </div>
          </Col>
        </>
      )}
    </Row>
  )
}

export default PostMediaLayout
