import { useRef } from 'react'
import { NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProfileData } from '../redux/actions'

const NavProfileCard = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const toggleRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logOut = () => {
    localStorage.removeItem('accessToken')
    navigate('/')
    window.location.reload()
  }

  const changeTheme = async () => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/users/me/changeTheme`,
        {
          method: 'PATCH',
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        dispatch(getProfileData())
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
    }
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
            changeTheme()
          }}
        >
          {user.lightTheme ? (
            <i className="bi bi-brightness-high-fill me-1"></i>
          ) : (
            <i className="bi bi-moon-stars-fill me-1"></i>
          )}
          Change theme
        </div>
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
              href="https://github.com/kaem0n"
              className="link-secondary underline"
            >
              GitHub
            </a>{' '}
            ·{' '}
            <a
              href="https://www.linkedin.com/in/antonio-ruggia-piquer-a086592b5/"
              className="link-secondary underline"
            >
              LinkedIn
            </a>{' '}
            ·{' '}
            <a
              href="https://www.instagram.com/_antoniorp_/"
              className="link-secondary underline"
            >
              Instagram
            </a>
          </p>
          <p>MeeToo &copy; {new Date().getFullYear()} by kaem0n</p>
        </div>
      </div>
    </NavDropdown>
  )
}

export default NavProfileCard
