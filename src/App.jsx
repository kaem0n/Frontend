import './custom_bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserSignUp from './components/UserSignUp'
import UserLogin from './components/UserLogin'
import Home from './components/Home'
import NavBar from './components/NavBar'
import Settings from './components/Settings'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getMyFollowerData,
  getMyFollowingData,
  getProfileData,
} from './redux/actions'
import ProfilePage from './components/ProfilePage'
import PostPage from './components/PostPage'

const App = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const reloadTrigger = useSelector((state) => state.reloadTrigger)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user === null) {
      dispatch(getProfileData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getProfileData())
    dispatch(getMyFollowerData())
    dispatch(getMyFollowingData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTrigger])

  return (
    <BrowserRouter>
      {accessToken ? <NavBar /> : <></>}
      <Routes>
        {accessToken ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:userID" element={<ProfilePage />} />
            <Route path="/post/:postID" element={<PostPage />} />
            <Route path="/settings" element={<Settings />} />
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
