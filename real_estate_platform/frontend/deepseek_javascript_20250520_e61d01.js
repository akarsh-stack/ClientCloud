import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/context/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}