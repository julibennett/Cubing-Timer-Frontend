import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SearchUsers from './pages/SearchUsers';
import ProtectedRoute from './components/ProtectedRoute';
import Chart from './components/Chart';
import Header from './components/Header';
import UserChart from './components/UserChart';

function Logout() {
  localStorage.clear();
  return <Navigate to='/login' />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/search-users' element={<ProtectedRoute><SearchUsers /></ProtectedRoute>} />
        <Route path='/chart' element={<ProtectedRoute><Chart /></ProtectedRoute>} />
        <Route path='/user/:userId/chart' element={<ProtectedRoute><UserChart /></ProtectedRoute>} />
        <Route path='/login' element={<Login route='/api/token/' method='login' />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<RegisterAndLogout />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
