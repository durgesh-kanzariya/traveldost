import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import { AppRoutes } from './app/routes'
import { Providers } from './app/providers'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <AppRoutes />
    </Providers>
  </StrictMode>,
)
