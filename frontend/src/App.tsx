import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Auth/Login'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Dashboard from './admin/Dashboard'
import PostList from './admin/Posts/PostList'
import PostEditor from './admin/Posts/PostEditor'
import Categories from './admin/Posts/Categories'
import Tags from './admin/Posts/Tags'
import PageList from './admin/Pages/PageList'
import PageEditor from './admin/Pages/PageEditor'
import MediaLibrary from './admin/Media/MediaLibrary'
import UserManagement from './admin/Users/UserManagement'
import Comments from './admin/Comments/Comments'
import Themes from './admin/Appearance/Themes'
import Customize from './admin/Appearance/Customize'
import Widgets from './admin/Appearance/Widgets'
import PageTemplateList from './admin/Appearance/PageTemplateList'
import PageTemplateBuilder from './admin/Appearance/PageTemplateBuilder'
import Menus from './admin/Appearance/Menus'
import Products from './admin/Products/Products'
import Plugins from './admin/Plugins/Plugins'
import Tools from './admin/Tools/Tools'
import GeneralSettings from './admin/Settings/GeneralSettings'

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />}
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
        path="/admin/products"
        element={
          <ProtectedRoute>
            <Products />
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
      
      {/* Posts submenu routes */}
      <Route
        path="/admin/posts/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/tags"
        element={
          <ProtectedRoute>
            <Tags />
          </ProtectedRoute>
        }
      />
      
      {/* Comments routes */}
      <Route
        path="/admin/comments"
        element={
          <ProtectedRoute>
            <Comments />
          </ProtectedRoute>
        }
      />
      
      {/* Appearance routes */}
      <Route
        path="/admin/appearance/themes"
        element={
          <ProtectedRoute>
            <Themes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appearance/customize"
        element={
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appearance/widgets"
        element={
          <ProtectedRoute>
            <Widgets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appearance/page-templates"
        element={
          <ProtectedRoute>
            <PageTemplateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appearance/page-templates/new"
        element={
          <ProtectedRoute>
            <PageTemplateBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appearance/page-templates/:id"
        element={
          <ProtectedRoute>
            <PageTemplateBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appearance/menus"
        element={
          <ProtectedRoute>
            <Menus />
          </ProtectedRoute>
        }
      />
      
      {/* Plugins routes */}
      <Route
        path="/admin/plugins"
        element={
          <ProtectedRoute>
            <Plugins />
          </ProtectedRoute>
        }
      />
      
      {/* Tools routes */}
      <Route
        path="/admin/tools"
        element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tools/import"
        element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tools/export"
        element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tools/site-health"
        element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        }
      />
      
      {/* Settings routes */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <GeneralSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/general"
        element={
          <ProtectedRoute>
            <GeneralSettings />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export default App
