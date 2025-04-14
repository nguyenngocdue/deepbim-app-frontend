interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <img
            src='./logo/logo.png'
            alt='Logo'
            className='h-12 w-12 rounded-full'
          />
          <h1 className='text-xl font-medium'>Deep Bim</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
