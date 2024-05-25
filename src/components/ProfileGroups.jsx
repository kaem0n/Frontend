/* eslint-disable react/prop-types */
import { Container, Row, Spinner } from 'react-bootstrap'
import ProfileGroupCard from './group/ProfileGroupCard'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import CreateGroup from './group/CreateGroup'

const ProfileGroups = ({ user }) => {
  const accessToken = localStorage.getItem('accessToken')
  const [isLoading, setLoading] = useState(false)
  const [founderGroups, setFounderGroups] = useState([])
  const [memberships, setMemberships] = useState([])
  const totalElements = useRef(0)
  const nextPage = useRef(0)
  const last = useRef(false)
  const counter = useRef(6)
  const params = useParams()

  const getFounderGroupData = async (page = 0) => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3030/api/groups/byFounder/${params.userID}?page=${page}&size=6&sort=creation`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setFounderGroups([...founderGroups, ...data.content])
        if (data.first) totalElements.current = data.totalElements
        if (data.last) last.current = true
        else nextPage.current += 1
        setLoading(false)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getUserMemberships = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3030/api/users/${params.userID}/memberships`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setMemberships(data)
        setLoading(false)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const printGroups = () => {
    return memberships
      .sort((membership1, membership2) => {
        return membership1.id - membership2.id
      })
      .filter((membership, i) => i < counter.current)
      .map((membership) => (
        <ProfileGroupCard key={membership.group.id} data={membership.group} />
      ))
  }

  useEffect(() => {
    const getFounderGroupData = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:3030/api/groups/byFounder/${params.userID}?page=0&size=6&sort=creation`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          setFounderGroups([...founderGroups, ...data.content])
          if (data.first) totalElements.current = data.totalElements
          if (data.last) last.current = true
          else nextPage.current += 1
          setLoading(false)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    const getUserMemberships = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:3030/api/users/${params.userID}/memberships`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setMemberships(data)
          setLoading(false)
        } else {
          const err = await res.json()
          throw new Error(err.message)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    getFounderGroupData()
    getUserMemberships()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container className="pb-5">
      {isLoading ? (
        <div className="group-card d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-3">
            <CreateGroup />
          </div>
          <h6>Groups founded by {user.username}:</h6>
          {founderGroups.length > 0 ? (
            <div className="mb-4">
              <Row xs={3} md={2} lg={3} xxl={4} className="g-3">
                {founderGroups.map((group) => (
                  <ProfileGroupCard key={group.id} data={group} />
                ))}
              </Row>
              {!last.current && (
                <div className="d-flex justify-content-center my-4">
                  <button
                    className="btn-clean"
                    onClick={() => getFounderGroupData(nextPage.current)}
                  >
                    Load more ({totalElements.current - 6 * nextPage.current}{' '}
                    remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <h3 className="text-secondary text-center mb-5">
              No data available.
            </h3>
          )}

          <h6>Groups {user.username} is member of:</h6>
          {memberships && memberships.length > 0 ? (
            <div className="mb-4">
              <Row xs={3} md={2} lg={3} xxl={4} className="g-3">
                {printGroups()}
              </Row>
              {memberships.length > counter.current && (
                <div className="d-flex justify-content-center my-4">
                  <button
                    className="btn-clean"
                    onClick={() => {
                      counter.current += 6
                      getUserMemberships()
                    }}
                  >
                    Load more ({memberships.length - counter.current} remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <h3 className="text-secondary text-center mb-5">
              No data available.
            </h3>
          )}
        </>
      )}
    </Container>
  )
}

export default ProfileGroups
