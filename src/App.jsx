import './custom_bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserSignUp from './components/UserSignUp'
import UserLogin from './components/UserLogin'
import Home from './components/Home'
import NavBar from './components/NavBar'
import Settings from './components/Settings'
import { useEffect, useState } from 'react'

const App = () => {
  const accessToken = localStorage.getItem('accessToken')
  const [user, setUser] = useState(null)

  const getUserData = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/users/me', {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        const userData = {
          id: data.id,
          boardId: data.board.id,
          username: data.username,
          email: data.email,
          proPic: data.proPicUrl,
          registration: data.registration,
          name: data.name,
          surname: data.surname,
          birthday: data.birthday,
          gender: data.gender,
          occupation: data.occupation,
          hobbies: data.hobbies,
          bio: data.bio,
        }
        setUser(userData)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user === null) {
      getUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      {accessToken ? <NavBar user={user} /> : <></>}
      <Routes>
        {accessToken ? (
          <>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/settings" element={<Settings user={user} />} />
          </>
        ) : (
          <Route path="*" element={<UserLogin />} />
        )}
        <Route path="/register" element={<UserSignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
