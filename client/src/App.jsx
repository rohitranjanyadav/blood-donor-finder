import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import DonorDashboard from './pages/DonorDashboard'
import PostRequest from './pages/PostRequest'
import RequestMap from './pages/RequestMap'
import RequestDetail from './pages/RequestDetail'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — no Navbar (handled inside each page) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/donor" element={<Login />} />
          <Route path="/register/patient" element={<Login />} />
          <Route path="/register/hospital" element={<Login />} />

          {/* Public with Navbar */}
          <Route path="/map" element={<><Navbar /><RequestMap /></>} />
          <Route path="/requests/:id" element={<><Navbar /><RequestDetail /></>} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/requests/new" element={
            <ProtectedRoute allowedRoles={['patient', 'hospital']}>
              <>
                <Navbar />
                <PostRequest />
              </>
            </ProtectedRoute>
          } />

          <Route path="/my-requests" element={
            <ProtectedRoute allowedRoles={['patient', 'hospital']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}