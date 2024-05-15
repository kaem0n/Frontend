import { Badge, Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

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

  const formatDate = (date, format = 'DD-MM-YYYY') => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const dateRef = new Date(date)
    const year = dateRef.getFullYear()
    const month = dateRef.getMonth()
    const day = dateRef.getDate()
    if (format === 'MM-DD-YYYY') {
      return `${months[month]} ${day}, ${year}`
    } else {
      return `${day} ${months[month]} ${year}`
    }
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
          <p className="mb-2">{formatDate(user.registration)}</p>
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
