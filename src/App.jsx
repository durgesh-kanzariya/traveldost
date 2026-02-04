import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { AboutContactSection } from './components/AboutContactSection'
import { Footer } from './components/Footer'
import { LoginPage } from './components/LoginPage'
import { SignUpPage } from './components/SignUpPage'
import { Dashboard } from './components/Dashboard'
import { NotFound } from './components/NotFound'
import { EmergencyPage } from './components/EmergencyPage'
import { TranslatorPage } from './components/TranslatorPage'
import { ChecklistPage } from './components/ChecklistPage'
import { SettingsPage } from './components/SettingsPage'
import { CurrencyConverterPage } from './components/CurrencyConverterPage'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutContactSection /> {/* Add this line */}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App