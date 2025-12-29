import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from './services/auth'
import Login from './components/Auth/Login'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Dashboard from './admin/Dashboard'
import PostList from './admin/Posts/PostList'
import PostEditor from './admin/Posts/PostEditor'
import PageList from './admin/Pages/PageList'
import PageEditor from './admin/Pages/PageEditor'
import MediaLibrary from './admin/Media/MediaLibrary'
import UserManagement from './admin/Users/UserManagement'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/admin" replace /> : <Login />}
        />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute>
              <PostList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/new"
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts/:id"
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pages"
          element={
            <ProtectedRoute>
              <PageList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pages/new"
          element={
            <ProtectedRoute>
              <PageEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pages/:id"
          element={
            <ProtectedRoute>
              <PageEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App
