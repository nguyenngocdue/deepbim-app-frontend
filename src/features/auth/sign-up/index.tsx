import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'
import { Separator } from '@/components/ui/separator'
import ParticlesContainer from '@/components/ParticlesContainer'

export default function SignUp() {
  return (
    <div className='relative z-10'>
      <ParticlesContainer />
      <AuthLayout>
        <Card className='p-6 h-full bg-behind'>
          <div className='mb-2 flex flex-col space-y-2 text-left'>
            <h1 className="text-lg font-semibold tracking-tight  dark:text-gray-100 text-gray-900">
              Create an account
            </h1>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              Enter your email and password to create an account. <br />
              Already have an account?{' '}
              <Link
                to='/sign-in'
                className='font-medium text-blue-600 dark:text-blue-300 hover:underline transition-colors duration-200'
              >
                Sign In
              </Link>
            </p>
          </div>
          <Separator orientation='horizontal' className='bg-zinc-300 dark:bg-zinc-600' />
          <SignUpForm />
        </Card>
      </AuthLayout>
    </div>
  )
}
