import { Outlet } from '@tanstack/react-router'
import { LanguageProvider } from '@/context/LanguageContext'
import Header from '@/sections/ Header'

export default function Settings() {
  return (
    <div className="w-full pt-4 flex flex-col bg-gradient-to-b from-indigo-50 bg-behind dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
     
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                   <LanguageProvider>
                     <Header />
                   </LanguageProvider>
                 </div>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto py-6 flex flex-col md:flex-row gap-4">
          {/* Settings Card */}
          <section className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-4 flex-1 min-h-[450px] transition-colors duration-300">
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
