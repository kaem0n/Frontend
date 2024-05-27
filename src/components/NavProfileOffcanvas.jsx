import { useState } from 'react'
import { Offcanvas } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProfileData } from '../redux/actions'

const NavProfileOffcanvas = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [show, setShow] = useState(false)
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
    user && (
      <>
        <button className="btn-clean" onClick={() => setShow(true)}>
          <img
            src={user.proPicUrl}
            alt="profile-picture"
            height={40}
            className="nav-propic border"
          />
        </button>

        <Offcanvas
          show={show}
          onHide={() => setShow(false)}
          placement="end"
          className="bg-body"
        >
          <Offcanvas.Header className="pb-0" closeButton></Offcanvas.Header>
          <Offcanvas.Body className="pt-2 d-flex flex-column">
            <div
              className="menu-option"
              onClick={() => {
                navigate('/profile/me')
                setShow(false)
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
            <div className="flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <div
                  className="menu-option py-3 px-2"
                  onClick={() => {
                    changeTheme()
                  }}
                >
                  {user.lightTheme ? (
                    <i className="bi bi-brightness-high-fill me-1"></i>
                  ) : (
                    <i className="bi bi-moon-stars-fill me-2"></i>
                  )}
                  Change theme
                </div>
                <div
                  className="menu-option py-3 px-2"
                  onClick={() => {
                    navigate('/settings')
                    setShow(false)
                  }}
                >
                  <i className="fa-solid fa-gear me-2"></i>
                  Settings
                </div>
              </div>
              <div>
                <div className="menu-option py-3 px-2" onClick={logOut}>
                  <i className="fa-solid fa-right-from-bracket me-2"></i>
                  Log Out
                </div>
                <div className="fs-7 text-secondary">
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
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    )
  )
}

export default NavProfileOffcanvas
