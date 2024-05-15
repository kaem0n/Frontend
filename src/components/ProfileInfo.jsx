import { Badge, Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import dateFormatter from '../utils/dateFormatter'

const ProfileInfo = () => {
  const user = useSelector((state) => state.profile)

  const calculateAge = (birthday) => {
    if (birthday !== null) {
      const today = new Date()
      const birthDate = new Date(birthday)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    } else return '/'
  }

  return (
    <Container>
      <Row>
        <Col xs={4} className="border-end text-end fw-semibold">
          <p className="mb-2">Age</p>
        </Col>
        <Col xs={8}>
          <p className="mb-2">{calculateAge(user.birthday)}</p>
        </Col>
        <Col xs={4} className="border-end text-end fw-semibold">
          <p className="mb-2">Gender</p>
        </Col>
        <Col xs={8}>
          <p className="mb-2">
            {user.gender.slice(0, 1) === 'U'
              ? 'Not specified'
              : user.gender.slice(0, 1)}
          </p>
        </Col>
        <Col xs={4} className="border-end text-end fw-semibold">
          <p className="mb-2">Member since</p>
        </Col>
        <Col xs={8}>
          <p className="mb-2">
            {dateFormatter(user.registration, user.dateFormat)}
          </p>
        </Col>
        <Col xs={4} className="border-end text-end fw-semibold">
          <br />
        </Col>
        <Col xs={8}>
          <br />
        </Col>
        <Col xs={4} className="border-end text-end fw-semibold">
          <p className="mb-2">Occupation</p>
        </Col>
        <Col xs={8}>
          <p className="mb-2">{user.occupation ? user.occupation : '/'}</p>
        </Col>
        <Col xs={4} className="border-end text-end fw-semibold">
          <p className="mb-2">Hobbies</p>
        </Col>
        <Col xs={8}>
          {user.hobbies
            ? user.hobbies.map((hobby, i) => (
                <Badge pill bg="info" className="me-1" key={hobby + i}>
                  {hobby}
                </Badge>
              ))
            : '/'}
        </Col>
      </Row>
    </Container>
  )
}

export default ProfileInfo
