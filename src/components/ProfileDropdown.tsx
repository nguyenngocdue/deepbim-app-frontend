import { Link, useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { useTranslation } from 'react-i18next'
import { handleSignout } from '@/api'
import { toast } from 'react-toastify';
import { clearUser } from '@/store/slices/AuthSlice'

export function ProfileDropdown() {
  const user = useAppSelector(state => state.auth.user);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { navigate } = useRouter();

  if (!user) {
    return (
      <Link to='/sign-in'>
        <Button variant='ghost' className='relative text-blue-500'>
            {t('navbar.auth')}
        </Button>
      </Link>
    )
  }
  const username = user ? user.username : 'guest';
  const email =  user ? user.email : 'anonymous';
  const avatarSrc = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const onSignout = async () => {
    try {
      await handleSignout();
      dispatch(clearUser());// Reset auth state trong Redux
      navigate({ to: '/sign-in' });
    } catch (error) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8 bg-violet-300 items-center'>
            <AvatarImage className='mt-1' src={avatarSrc || undefined} alt={username} />
            <AvatarFallback>{getInitials(username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{username}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DropdownMenuItem onClick={onSignout} className="cursor-pointer">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

