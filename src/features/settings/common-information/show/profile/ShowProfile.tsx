import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaGlobe, FaEnvelope, FaBirthdayCake, FaCalendarAlt, FaUser, FaUserShield } from "react-icons/fa"
import { Link } from '@tanstack/react-router'
import { useAppSelector } from '@/hooks/reduxHooks'
import { toYYYYMMDD } from '@/utils/date-time'

const SOCIAL_NETWORKS_ICON: Record<string, any> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  github: FaGithub,
  website: FaGlobe,
};

function extractSocialLinks(socialMedia?: { name: string, link: string }[]) {
  if (!socialMedia) return [];
  return socialMedia
    .filter(s => !!s.name && !!s.link)
    .map(s => ({
      name: s.name.trim().toLowerCase(),
      link: s.link,
    }));
}

export default function ShowProfile() {
  const { user } = useAppSelector((state) => state.auth);

  const socialLinks = extractSocialLinks(user?.social_media);

  const profile = {
    fullName: user?.full_name || "No Name",
    username: user?.user_name || "No username",
    email: user?.email || "Not updated",
    avatar: user?.picture || "",
    memberSince: user?.created_at ? toYYYYMMDD(user.created_at) : "Not updated",
    bio: user?.bio || "",
    nickName: user?.nick_name || "",
    birthday: user?.birthday || "",
    is_verified: user?.is_verified,
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 via-blue-50 to-zinc-100 dark:from-[#111729] dark:via-[#232946] dark:to-[#181c24] px-4 py-10">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 items-stretch">
        {/* Sidebar: Avatar + Bio + Social + Edit */}
        <Card className="md:w-1/3 w-full flex flex-col items-center bg-white/80 dark:bg-[#191e26]/95 rounded-3xl shadow-2xl border-0 backdrop-blur-md p-0">
          <div className="w-full flex flex-col items-center py-10 px-6 relative">
            {/* Verified badge */}
            {profile.is_verified && (
              <span className="absolute top-6 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2">
                <FaUserShield className="inline" /> Verified
              </span>
            )}
            <Avatar className="w-32 h-32 mb-5 shadow-lg border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800">
              <AvatarImage src={profile.avatar} alt="Avatar" />
              <AvatarFallback className="text-4xl">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {/* Bio under avatar */}
            <div className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-base text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 mb-3 text-center min-h-[56px]">
              {profile.bio || <span className="italic text-zinc-400">No bio provided.</span>}
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{profile.fullName}</div>
            <div className="text-base text-zinc-500 dark:text-zinc-400 mb-1">@{profile.username}</div>
            {profile.nickName && (
              <div className="text-base text-blue-500 font-semibold mb-2">@{profile.nickName}</div>
            )}
            {/* Social link icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-2 mb-4 flex-wrap justify-center">
                {socialLinks.map(({ name, link }) => {
                  const Icon = SOCIAL_NETWORKS_ICON[name] || FaGlobe;
                  return (
                    <SocialLink
                      key={name + link}
                      icon={<Icon size={20} />}
                      href={link.startsWith("http") ? link : `https://${link}`}
                      color={getSocialColor(name)}
                      label={capitalizeFirstLetter(name)}
                    />
                  )
                })}
              </div>
            )}
            <Link
              to={`/user/settings/profile/edit/${user?.id}`}
              className="mt-5 inline-block bg-gradient-to-tr from-indigo-500 to-blue-400 hover:from-indigo-700 hover:to-blue-500 text-white px-6 py-2 rounded-xl shadow font-semibold transition"
            >
              Edit Profile
            </Link>
          </div>
        </Card>

        {/* Main Profile Info (Personal Info) */}
        <Card className="flex-1 flex flex-col justify-center rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-[#191e26]/95 p-0">
          <CardHeader className="px-10 pt-10 pb-2">
            <CardTitle className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
              <FaUser className="inline-block text-indigo-600 dark:text-indigo-400" size={26}/> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-12 px-10 flex flex-col gap-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
              <ProfileInfo icon={<FaUser />} label="Full Name" value={profile.fullName} />
              <ProfileInfo icon={<FaUser />} label="Username" value={profile.username} />
              <ProfileInfo icon={<FaEnvelope />} label="Email" value={profile.email} />
              <ProfileInfo icon={<FaBirthdayCake />} label="Birthday" value={profile.birthday || "Not updated"} />
              <ProfileInfo icon={<FaCalendarAlt />} label="Member Since" value={profile.memberSince} />
              <ProfileInfo icon={<FaUserShield />} label="Verification Status" value={profile.is_verified ? "Verified" : "Not verified"} />
            </div>
            {/* Social networks (full link) */}
            {socialLinks.length > 0 && (
              <div>
                <div className="font-semibold text-zinc-700 dark:text-zinc-200 mb-3 flex items-center gap-2">
                  <FaGlobe /> Social Networks
                </div>
                <div className="flex gap-4 flex-wrap">
                  {socialLinks.map(({ name, link }) => {
                    const Icon = SOCIAL_NETWORKS_ICON[name] || FaGlobe;
                    return (
                      <ProfileInfo
                        key={name + link}
                        icon={<Icon />}
                        label={capitalizeFirstLetter(name)}
                        value={
                          <a
                            href={link.startsWith("http") ? link : `https://${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-indigo-500"
                          >
                            {link}
                          </a>
                        }
                        className="flex-1 min-w-[170px]"
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Info row with icon and label
function ProfileInfo({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && (
        <span className="text-lg text-indigo-600 dark:text-indigo-400">{icon}</span>
      )}
      <div>
        <div className="text-base font-semibold text-zinc-700 dark:text-zinc-200 mb-1">{label}</div>
        <div className="text-lg text-zinc-800 dark:text-zinc-100">{value}</div>
      </div>
    </div>
  );
}

// Social link with icon
function SocialLink({
  icon,
  href,
  color,
  label,
}: {
  icon: React.ReactNode
  href: string
  color: string
  label?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-1 rounded-lg ${color} bg-zinc-100 dark:bg-zinc-800 hover:opacity-80 transition font-medium`}
      title={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </a>
  )
}

// Helper: Social color
function getSocialColor(name: string) {
  switch (name) {
    case "facebook": return "text-blue-600 dark:text-blue-400";
    case "twitter": return "text-sky-500 dark:text-sky-300";
    case "linkedin": return "text-sky-700 dark:text-sky-400";
    case "instagram": return "text-pink-600 dark:text-pink-400";
    case "github": return "text-zinc-700 dark:text-zinc-100";
    default: return "text-indigo-600 dark:text-indigo-300";
  }
}
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
