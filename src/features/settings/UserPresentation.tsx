import { Outlet } from '@tanstack/react-router'
import { ThemeSwitch } from '@/components/theme-switch'
import { Header } from './header'
import { ProfileDropdown } from '@/components/common/ProfileDropdown'
import { LogoWord } from '@/components/LogoWord'
import { CLASS_NAME_DEFAULT } from '@/utils/class'

export default function UserPresentation() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-indigo-100 to-slate-200 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
      {/* Header */}
      <header
        className={`${CLASS_NAME_DEFAULT.CLASS_NAME_3} fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/60 dark:bg-zinc-900/60 shadow-md transition-all duration-300`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-2">
          <div className="flex items-center space-x-2">
            <LogoWord />
          </div>
          <h1 className="hidden md:block text-2xl font-extrabold tracking-tight text-indigo-700 dark:text-pink-400 drop-shadow-sm uppercase">
            Personal Information
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pt-12"> {/* pt-24 để tránh header che */}
        <div className="container mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-6">
          {/* Settings Card */}
          <section className="w-full  mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-10 min-h-[400px] transition-colors duration-300 border border-zinc-100 dark:border-zinc-800">
            <div className="mb-8 space-y-2 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-700 dark:text-pink-400">
                Account Settings
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg">
                Manage your account settings and set email preferences.
              </p>
            </div>
            <div className="w-full">
              <Outlet />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
