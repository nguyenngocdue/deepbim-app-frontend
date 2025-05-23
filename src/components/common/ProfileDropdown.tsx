import { Link, useRouter } from '@tanstack/react-router'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ImProfile } from "react-icons/im";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { handleSignout } from '@/api';
import { clearUser } from '@/store/slices/AuthSlice';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import CustomBadge from '@/components/common/CustomBadge';
import { HiOutlinePresentationChartLine } from 'react-icons/hi2';
import { GiTeamIdea } from 'react-icons/gi';
import { VscVersions } from 'react-icons/vsc';

export function ProfileDropdown() {

  const { user, loading } = useAppSelector((state) => state.auth);
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const onSignout = async () => {
    navigate({ to: '/sign-in' });
    try {
      await handleSignout(); // có thể lỗi nếu session mất
    } catch (error: any) {
      console.warn("Session might already be gone:", error.message);
    } finally {
      dispatch(clearUser());
    }
  };

  const username = user?.user_name || 'guest';
  const email = user?.email || 'anonymous';
  const avatarUrl: string = user?.picture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
  const bio = user?.bio;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={avatarUrl} alt='@shadcn' />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{username}</p>
            <p className='text-muted-foreground text-xs leading-none'>{email}</p>
            <p className='text-muted-foreground text-xs leading-none pt-2 italic'>{bio}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/user/show/profile'>
              Profile
              <DropdownMenuShortcut><ImProfile size={16} /></DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/user/show/portfolio'>
              Portfolio
              <DropdownMenuShortcut><HiOutlinePresentationChartLine size={16} /></DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team <CustomBadge text='Dev' className="bg-red-700" />
            <DropdownMenuShortcut><GiTeamIdea size={16} /></DropdownMenuShortcut>
          </DropdownMenuItem>


          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/user/show/cv">My CV
                <DropdownMenuShortcut><VscVersions size={16} /></DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignout} className="cursor-pointer">
          Sign out
          <DropdownMenuShortcut><RiLogoutCircleRLine size={16} /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
