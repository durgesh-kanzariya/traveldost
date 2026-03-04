import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout/Landing Components
import { Navbar, Footer, BackToTop } from './components/layout'
import { ProtectedRoute, AdminRoute, AdminErrorBoundary } from './components/auth'
import { HeroSection, FeaturesSection, HowItWorksSection, AboutContactSection } from './components/sections'

// Lazy load Page Components (from ./pages/)
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const SignUpPage = lazy(() => import('./pages/SignUpPage').then(module => ({ default: module.SignUpPage })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })))
const EmergencyPage = lazy(() => import('./pages/EmergencyPage').then(module => ({ default: module.EmergencyPage })))
const TranslatorPage = lazy(() => import('./pages/TranslatorPage').then(module => ({ default: module.TranslatorPage })))
const ChecklistPage = lazy(() => import('./pages/ChecklistPage').then(module => ({ default: module.ChecklistPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })))
const CurrencyConverterPage = lazy(() => import('./pages/CurrencyConverterPage').then(module => ({ default: module.CurrencyConverterPage })))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
const UserManagement = lazy(() => import('./pages/admin/UserManagement').then(module => ({ default: module.UserManagement })))
const ManageGuides = lazy(() => import('./pages/admin/ManageGuides').then(module => ({ default: module.ManageGuides })))
const TripsPage = lazy(() => import('./pages/TripsPage').then(module => ({ default: module.TripsPage })))
const ExpenseTrackerPage = lazy(() => import('./pages/ExpenseTrackerPage').then(module => ({ default: module.ExpenseTrackerPage })))



function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
        </div>
      }>
        <Routes>
          {/* --- PUBLIC ROUTES (Anyone can access) --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* --- PROTECTED ROUTES (Must be logged in) --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <EmergencyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/translator"
            element={
              <ProtectedRoute>
                <TranslatorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checklist"
            element={
              <ProtectedRoute>
                <ChecklistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/currency-converter"
            element={
              <ProtectedRoute>
                <CurrencyConverterPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpenseTrackerPage />
              </ProtectedRoute>
            }
          />

          {/* --- ADMIN ROUTES --- */}
          <Route
            path="/admin/*"
            element={
              <AdminErrorBoundary>
                <Routes>
                  <Route
                    path="dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <AdminRoute>
                        <UserManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="guides"
                    element={
                      <AdminRoute>
                        <ManageGuides />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </AdminErrorBoundary>
            }
          />

          {/* --- CATCH-ALL (404) --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App