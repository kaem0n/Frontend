import Post from './Post'
import { Col, Container, Row } from 'react-bootstrap'

const Home = () => {
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={9} lg={6} xxl={5}>
          <Post />
        </Col>
      </Row>
    </Container>
  )
}

export default Home
