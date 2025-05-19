import { Outlet } from '@tanstack/react-router'
import { ThemeSwitch } from '@/components/theme-switch'
import { Header } from './header'
import { ProfileDropdown } from '@/components/common/ProfileDropdown'

export default function UserPresentation() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-indigo-50 bg-behind dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
      {/* Header */}
      <Header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Personal Information
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto py-6 flex flex-col md:flex-row gap-4">
          {/* Settings Card */}
          <section className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-4 flex-1 min-h-[350px] transition-colors duration-300">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-zinc-900 dark:text-zinc-100">
                Account Settings
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Manage your account settings and set email preferences.
              </p>
            </div>
            <div className="w-full ">
              <Outlet />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
