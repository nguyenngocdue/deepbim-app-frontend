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
import { toast } from 'react-toastify'
import { clearUser } from '@/store/slices/AuthSlice'

export function ProfileDropdown({user} : any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { navigate } = useRouter();

  const username = user?.username || 'guest';
  const email = user?.email || 'anonymous';
  const avatarUrl: string = String(user?.picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const onSignout = async () => {
    try {
      await handleSignout()
      dispatch(clearUser()) // Reset auth state trong Redux
      navigate({ to: '/sign-in' })
    } catch (error) {
      toast.error(
        (error as any)?.message || 'Failed to sign out'
      )
    }
  }


  // Nếu chưa đăng nhập, hiện nút đăng nhập
  if (!user) {
    return (
      <Link to="/sign-in">
        <Button variant="ghost" className="relative text-blue-500">
          {t('navbar.auth')}
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{getInitials(username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onSignout} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
