import './custom_bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserSignUp from './components/UserSignUp'
import Login from './components/Login'
import Home from './components/Home'
import NavBar from './components/NavBar'

const App = () => {
  const accessToken = localStorage.getItem('accessToken')

  return (
    <BrowserRouter>
      {accessToken ? <NavBar /> : <></>}
      <Routes>
        <Route
          path="/register"
          element={accessToken ? <Home /> : <UserSignUp />}
        />
        <Route path="/" element={accessToken ? <Home /> : <Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
