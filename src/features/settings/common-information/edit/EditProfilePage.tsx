import { useAppSelector } from '@/hooks/reduxHooks'
import { toYYYYMMDD } from '@/utils/date-time'
import { useEffect, useState } from 'react'
import { ProfileFormTabs } from './components/ProfileFormTabs'

export default function EditProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const profile = {
    user_id: user?.id || null,
    full_name: user?.full_name || "No Name",
    user_name: user?.user_name || "No username",
    nick_name: user?.nick_name || "",
    email: user?.email || "Not updated",
    avatar: user?.mediaAvatar?.url || user?.picture,
    member_since: user?.created_at ? toYYYYMMDD(user.created_at) : "Not updated",
    bio: user?.bio || "",
    birthday: user?.birthday || "",
    is_verified: user?.is_verified,
    social_profiles: user?.social_media || {},
  }

  const [avatar, setAvatar] = useState(profile.avatar)
  useEffect(() => {
    setAvatar(profile.avatar);
  }, [profile.avatar]);


  return (
    <div className="p-4 bg-gradient-to-br from-indigo-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center px-4">
      <div className=" w-full ">
        <ProfileFormTabs profile={profile} />
      </div>
    </div>
  )
}
