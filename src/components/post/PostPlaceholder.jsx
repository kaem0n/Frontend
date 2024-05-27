import { Card, Placeholder } from 'react-bootstrap'

const PostPlaceholder = () => (
  <Card className="bg-body-tertiary my-4">
    <Card.Body>
      <Placeholder
        as="div"
        animation="glow"
        className="d-flex align-items-center mb-5"
      >
        <Placeholder className="placeholder-propic me-2" />
        <div className="d-flex flex-column flex-grow-1">
          <Placeholder xs={3} className="mb-2 rounded-3" />
          <Placeholder xs={2} size="sm" className="rounded-3" />
        </div>
      </Placeholder>
      <Placeholder as="div" animation="wave" className="mb-5">
        <Placeholder xs={12} size="sm" className="rounded-3 mb-3" />
        <Placeholder xs={12} size="sm" className="rounded-3 mb-3" />
        <Placeholder xs={12} size="sm" className="rounded-3 mb-3" />
      </Placeholder>
      <Placeholder
        as="div"
        animation="wave"
        className="d-flex justify-content-between"
      >
        <Placeholder xs={1} size="sm" className="rounded-3" />
        <Placeholder xs={2} size="sm" className="rounded-3" />
      </Placeholder>
    </Card.Body>
    <Card.Footer className="bg-body py-3">
      <Placeholder
        as="div"
        animation="glow"
        className="d-flex justify-content-evenly"
      >
        <Placeholder xs={2} size="lg" className="rounded-4" />
        <Placeholder xs={2} size="lg" className="rounded-4" />
      </Placeholder>
    </Card.Footer>
  </Card>
)

export default PostPlaceholder
