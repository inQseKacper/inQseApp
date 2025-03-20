import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import VerifyCode from "./pages/VerifyCode"
import RequestResetPasswod from "./pages/RequestResetPassword"
import ResetPassword from "./pages/ResetPassword"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/password-reset" element={<RequestResetPasswod />} />
        <Route path="/password-reset-confirm/:uidb64/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App