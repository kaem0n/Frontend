import './custom_bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserSignUp from './components/UserSignUp'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<UserSignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
