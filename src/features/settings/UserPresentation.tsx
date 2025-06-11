import { Outlet, Link, useMatch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FaUser, FaCog, FaEnvelope, FaLock } from 'react-icons/fa'
import { LanguageProvider } from '@/context/LanguageContext'
import Header from '@/sections/ Header'

export default function UserPresentation() {
  const navItems = [
    { to: '/user/settings/profile', label: 'Profile', icon: <FaUser className="text-lg" /> },
    { to: '/user/settings/account', label: 'Account', icon: <FaCog className="text-lg" /> },
    { to: '/user/settings/email', label: 'Email', icon: <FaEnvelope className="text-lg" /> },
    { to: '/user/settings/security', label: 'Security', icon: <FaLock className="text-lg" /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-sm transition-all duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <LanguageProvider>
            <Header />
          </LanguageProvider>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pt-16 sm:pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          {/* <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full lg:w-72 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-md p-4 sm:p-6 border border-gray-100/50 dark:border-gray-700/50 sticky top-20 lg:top-24 h-fit"
          >
            <nav className="space-y-1">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Settings
              </h3>
              {navItems.map((item) => {
                const isActive = useMatch({ to: item.to }) !== null
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.aside> */}

          {/* Settings Content */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex-1 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-md p-6 sm:p-8 lg:p-10 border border-gray-100/50 dark:border-gray-700/50"
          >
            <div className="mb-6 sm:mb-8 space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                Account Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                Customize your account details, preferences, and security settings.
              </p>
            </div>
            <div className="w-full">
              <Outlet />
            </div>
          </motion.section>
        </div>
      </main>
    </motion.div>
  )
}