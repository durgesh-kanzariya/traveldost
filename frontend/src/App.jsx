import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout/Landing Components (from ./components/)
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { AboutContactSection } from './components/AboutContactSection'
import { Footer } from './components/Footer'

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

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutContactSection />
      </main>
      <Footer />
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/translator" element={<TranslatorPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/currency-converter" element={<CurrencyConverterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App