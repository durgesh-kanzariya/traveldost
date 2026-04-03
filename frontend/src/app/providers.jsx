import { ThemeProvider } from '../shared/context/ThemeContext'

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
