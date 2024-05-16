import react from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import AddFriends from './pages/AddFriends'
import ProtectedRoute from './components/ProtectedRoute'

function Logout() {
  localStorage.clear()
  return <Navigate to='/login' />
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
        path='/' 
        element={
          <ProtectedRoute>
            <Home />
            <AddFriends />
          </ProtectedRoute>
        }
        />
        <Route path='/login' element={<Login />}/>
        <Route path='/logout' element={<Logout />}/>
        <Route path='/register' element={<RegisterAndLogout />}/>
        <Route path='*' element={<NotFound />}/>
        <Route path="/add-friends" element={AddFriends} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
