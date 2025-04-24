import ViteLogo from '@/assets/vite.svg'
import { UserAuthForm } from './components/user-auth-form'
import { LogoWord } from '@/components/LogoWord'
import ParticlesContainer from '@/components/ParticlesContainer'
import MyRoom from '@/features/my-room-3d/components/MyRoom'

export default function SignIn2() {
  return (
    <div className='relative z-10'>
      <ParticlesContainer/>
      <div className='relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 w-full'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex bg-transparent'>
          {/* Thay đổi gradient từ emerald sang blue/indigo */}
          <div className="absolute  " />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <LogoWord/>
          </div>
          {/* My room 3D */}
          <div>
            <MyRoom/>
          </div>
          
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-sm font-heading text-subtitle2'>
                "Deep Bim is a powerful tool for BIM professionals, providing
                advanced features and seamless integration with industry standards.
                With its intuitive interface and robust functionality, it streamlines
                workflows and enhances collaboration."
              </p>
              <footer className='text-sm'>Nissan</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8  h-full bg-transparent'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[500px]'>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking login, you agree to our{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}