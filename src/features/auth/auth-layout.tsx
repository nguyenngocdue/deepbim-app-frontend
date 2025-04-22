import { LogoWord } from "@/components/LogoWord"

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='bg-behind container grid h-svh overflow-y-auto flex-col items-center justify-center lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='m-auto p-2'>
          <LogoWord />
        </div>
        {children}
      </div>
    </div>
  )
}
