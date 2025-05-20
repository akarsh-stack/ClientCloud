import Navbar from './Navbar'
import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function Layout({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {loading ? <LoadingSpinner /> : children}
      </main>
      <Footer />
    </div>
  )
}