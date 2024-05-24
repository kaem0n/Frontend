/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ProfileGroupCard = ({ data }) => {
  const accessToken = localStorage.getItem('accessToken')
  const [memberships, setMemberships] = useState(0)
  const [posts, setPosts] = useState(0)

  useEffect(() => {
    const getMembershipNumber = async () => {
      try {
        const res = await fetch(
          `http://localhost:3030/api/groups/${data.id}/memberships`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const result = await res.json()
          setMemberships(result.length)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getPostNumber = async () => {
      try {
        const res = await fetch(
          `http://localhost:3030/api/posts/byBoard/${data.board.id}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const result = await res.json()
          setPosts(result.totalElements)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getMembershipNumber()
    getPostNumber()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Col>
      <Card className="bg-body-tertiary group-card">
        <Card.Body
          className="p-0 group-card-bg"
          style={{
            background: `linear-gradient(0deg, var(--bs-tertiary-bg) 35%, rgba(0,0,0,0) 80%), ${
              data.coverUrl ? `url(${data.coverUrl})` : 'var(--bs-body-bg)'
            }`,
          }}
        >
          <div className="px-2 d-flex flex-column justify-content-end h-100">
            <Link
              to={`/group/${data.id}`}
              className="fw-semibold link-body-emphasis"
            >
              {data.name}
            </Link>
            <p className="fs-7">Members: {memberships}</p>
            <p className="fs-7">Posts: {posts}</p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ProfileGroupCard
