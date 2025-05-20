import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Prime Properties
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link href="/properties" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Properties
            </Link>
            {user ? (
              <>
                {user.role === 'agent' && (
                  <Link href="/dashboard" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Logout
                </button>
                <span className="text-sm font-medium">{user.name}</span>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                  Login
                </Link>
                <Link href="/register" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {mounted && (theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              ))}
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 pb-3 px-4">
          <div className="flex flex-col space-y-2">
            <Link href="/" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link href="/properties" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
              Properties
            </Link>
            {user ? (
              <>
                {user.role === 'agent' && (
                  <Link href="/dashboard" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                >
                  Logout
                </button>
                <span className="px-3 py-2 text-sm font-medium">{user.name}</span>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                  Login
                </Link>
                <Link href="/register" className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
              aria-label="Toggle dark mode"
            >
              {mounted && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}