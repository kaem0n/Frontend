import { useRef } from 'react'
import { NavDropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const NavProfileCard = () => {
  const user = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const toggleRef = useRef()

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
            src={user.proPicUrl}
            alt="profile-picture"
            height={40}
            className="nav-propic border"
          />
        )
      }
    >
      <div className="profile-menu p-2 fs-7">
        <div
          className="menu-option"
          onClick={() => {
            navigate('/profile/me')
            toggleRef.current.click()
          }}
        >
          <img
            src={user.proPicUrl}
            alt="profile-picture"
            height={50}
            className="card-propic border me-2"
          />
          <p className="fs-5 fw-semibold">{user.username}</p>
        </div>

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
