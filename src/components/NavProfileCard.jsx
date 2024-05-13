/* eslint-disable react/prop-types */
import { useRef } from 'react'
import { NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NavProfileCard = ({ user }) => {
  const navigate = useNavigate()
  const toggleRef = useRef(null)

  const logOut = () => {
    localStorage.removeItem('accessToken')
    navigate('/')
    window.location.reload()
  }

  return (
    <NavDropdown
      align="end"
      ref={toggleRef}
      className="d-flex justify-content-center align-items-center"
      title={
        user && (
          <img
            src={user.proPic}
            alt="profile-picture"
            height={40}
            className="rounded-circle border"
          />
        )
      }
    >
      <div className="profile-menu px-2 fs-7">
        {user && (
          <div
            className="menu-option"
            onClick={() => {
              navigate('/me')
              toggleRef.current.click()
            }}
          >
            <img
              src={user.proPic}
              alt="profile-picture"
              height={50}
              className="rounded-circle border me-2"
            />
            <p className="fs-5 fw-semibold">{user.username}</p>
          </div>
        )}
        <hr />
        <div
          className="menu-option"
          onClick={() => {
            navigate('/settings')
            toggleRef.current.click()
          }}
        >
          <i className="fa-solid fa-gear me-1"></i>
          Settings
        </div>
        <div className="menu-option" onClick={logOut}>
          <i className="fa-solid fa-right-from-bracket me-1"></i>
          Log Out
        </div>
        <div className="fs-8 text-secondary">
          <p>
            <a
              href="https://github.com/kaem0n/meetoo"
              className="link-secondary underline"
            >
              GitHub Repository
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/kaem0n"
              className="link-secondary underline"
            >
              kaem0n
            </a>
          </p>
          <p>MeeToo &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </NavDropdown>
  )
}

export default NavProfileCard
