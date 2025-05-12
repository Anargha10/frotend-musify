import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { useUserData } from "./context/userContext"
import Loading from "./components/Loading"
import Register from "./pages/Register"
import Album from "./pages/Album"
import PlayList from "./pages/PlayList"
import Admin from "./pages/Admin"
import EmailVerification from "./pages/EmailVerification"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/resetPassword"
const App = () => {
  const {isAuth, loading}= useUserData()
  return (
  
    <>
    {loading?(<Loading/>) : 
    (<BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/album/:id" element={<Album />} />
      <Route path="/playlist" element={isAuth?<PlayList />: <Login/>} />
      <Route path="/admin/dashboard" element={isAuth?<Admin />: <Login/>} />
      
      <Route path="/login" element={ isAuth? <Home/>: <Login />} />
      <Route path="/register" element={ isAuth? <Home/>: <Register />} />
      <Route path="/verify-email" element={ < EmailVerification />} />
      <Route path="/forgot-password" element={ < ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword/> } />
    </Routes>
    </BrowserRouter>)}
    </>
  )
}

export default App