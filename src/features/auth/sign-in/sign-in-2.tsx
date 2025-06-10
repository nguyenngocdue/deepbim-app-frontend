import { UserAuthForm } from './components/user-auth-form'
import { LogoWord } from '@/components/LogoWord'
import ParticlesContainer from '@/components/ParticlesContainer'
import MyRoom from '@/features/my-room-3d/components/MyRoom'
import { useEffect } from 'react'

export default function SignIn2() {

  useEffect(() => {
    document.body.classList.add("signin-page")
    return () => {
      document.body.classList.remove("signin-page")
    }
  }, [])

  return (
    <div className='relative z-10 h-svh'>
      <ParticlesContainer/>
      <div className='relative grid flex-col w-full h-full items-center px-4 lg:px-0 md:px-0 lg:max-w-none lg:grid-cols-2 overflow-x-hidden '>
        <div className='relative h-full flex-col lg:flex'>
          {/* Thay đổi gradient từ emerald sang blue/indigo */}
          <div className='relative z-20 p-4 lg:p-5 md:p-2 flex flex-1  sm:flex-none justify-center sm:justify-start items-center text-lg font-medium '>
            <LogoWord size='lg' path="/images/logo_no_bg.png"/>
          </div>
          
          <div className='absolute bottom-10 left-0 right-0 px-10 z-20 invisible  lg:visible md:visible'>
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
          {/* My room 3D */}
          <div className='w-full h-hull invisible lg:visible'>
            <MyRoom showFakeLights={true}/>
          </div>
          
        </div>
        <div className='lg:p-8  h-svh bg-transparent overflow-y-auto'>
          <div className='mx-auto flex w-full h-full flex-col justify-center space-y-2 sm:w-[500px]'>
            <UserAuthForm />
          </div>
        </div>
      </div>

    </div>
  )
}