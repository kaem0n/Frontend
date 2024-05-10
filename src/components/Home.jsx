import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const logOut = () => {
    localStorage.removeItem('accessToken')
    window.location.reload()
  }

  useEffect(() => {
    if (
      localStorage.getItem('accessToken') &&
      location.pathname === '/register'
    ) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button onClick={logOut}>Log Out</button>
    </>
  )
}

export default Home
