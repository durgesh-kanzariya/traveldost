import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar, Footer, BackToTop } from '../components/layout'
import { HeroSection, FeaturesSection, HowItWorksSection, AboutContactSection } from '../components/sections'
import { ProtectedRoute, AdminRoute, AdminErrorBoundary } from '../features/auth'

// Lazy load Page Components
export const LoginPage = lazy(() => import('../features/auth/LoginPage').then(module => ({ default: module.LoginPage })))
export const SignUpPage = lazy(() => import('../features/auth/SignUpPage').then(module => ({ default: module.SignUpPage })))
export const Dashboard = lazy(() => import('../features/dashboard/DashboardPage').then(module => ({ default: module.Dashboard })))
export const EmergencyPage = lazy(() => import('../features/emergency/EmergencyPage').then(module => ({ default: module.EmergencyPage })))
export const TranslatorPage = lazy(() => import('../features/translator/TranslatorPage').then(module => ({ default: module.TranslatorPage })))
export const ChecklistPage = lazy(() => import('../features/checklist/ChecklistPage').then(module => ({ default: module.ChecklistPage })))
export const SettingsPage = lazy(() => import('../features/settings/SettingsPage').then(module => ({ default: module.SettingsPage })))
export const CurrencyConverterPage = lazy(() => import('../features/currency/CurrencyConverterPage').then(module => ({ default: module.CurrencyConverterPage })))
export const NotFound = lazy(() => import('../components/layout/NotFound').then(module => ({ default: module.NotFound })))
export const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
export const UserManagement = lazy(() => import('../features/admin/UserManagement').then(module => ({ default: module.UserManagement })))
export const ManageGuides = lazy(() => import('../features/admin/ManageGuides').then(module => ({ default: module.ManageGuides })))
export const TripsPage = lazy(() => import('../features/trips/TripsPage').then(module => ({ default: module.TripsPage })))
export const ExpenseTrackerPage = lazy(() => import('../features/expenses/ExpenseTrackerPage').then(module => ({ default: module.ExpenseTrackerPage })))

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Suspense
				fallback={
					<div className="flex min-h-screen items-center justify-center bg-slate-50">
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
					</div>
				}
			>
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
