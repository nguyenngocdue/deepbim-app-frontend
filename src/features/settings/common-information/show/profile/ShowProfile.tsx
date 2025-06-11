import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaGlobe, FaEnvelope, FaBirthdayCake, FaCalendarAlt, FaUser, FaUserShield, FaEdit } from "react-icons/fa"
import { Link } from '@tanstack/react-router'
import { useAppSelector } from '@/hooks/reduxHooks'
import { toYYYYMMDD } from '@/utils/date-time'
import { motion } from 'framer-motion' // Ensure this import is present

const SOCIAL_NETWORKS_ICON: Record<string, any> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  github: FaGithub,
  website: FaGlobe,
};

function extractSocialLinks(socialMedia?: { name: string, link: string }[]) {
  if (!socialMedia || !Array.isArray(socialMedia)) return [];
  return socialMedia
    .filter(s => s?.name && s?.link && typeof s.name === 'string' && typeof s.link === 'string')
    .map(s => ({
      name: s.name.trim().toLowerCase(),
      link: s.link,
    }));
}

export default function ShowProfile() {
  const { user, loading, error } = useAppSelector((state) => ({
    user: state.auth.user,
    loading: state.auth.loading || false,
    error: state.auth.error || null,
  }));

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center text-red-600 dark:text-red-400">
          Error: {error.message || 'Failed to load profile data.'}
        </div>
      </div>
    );
  }

  // Handle no user state
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-300">
          No user data available. Please <Link to="/login" className="text-indigo-600 dark:text-indigo-400 underline">log in</Link>.
        </div>
      </div>
    );
  }

  const socialLinks = extractSocialLinks(user?.social_media);

  const profile = {
    fullName: user?.full_name || "No Name",
    username: user?.user_name || "No username",
    email: user?.email || "Not updated",
    avatar: user?.picture || "",
    memberSince: user?.created_at ? toYYYYMMDD(user.created_at) : "Not updated",
    bio: user?.bio || "",
    nick_name: user?.nick_name || "",
    birthday: user?.birthday || "",
    is_verified: user?.is_verified || false,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" flex justify-center items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 sm:py-12"
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Avatar + Bio + Social */}
        <Card className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col items-center p-6 sm:p-8 relative">
            {/* Edit Icon */}
            <motion.div
              className="absolute top-4 left-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/user/settings/profile/edit/${user?.id || ''}`}
                aria-label="Edit Profile"
              >
                <FaEdit
                  className="text-indigo-600 dark:text-indigo-400 text-lg cursor-pointer"
                />
              </Link>
            </motion.div>
            {/* Verified badge */}
            {profile.is_verified && (
              <span className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <FaUserShield /> Verified
              </span>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white dark:border-gray-700 shadow-md">
                <AvatarImage src={profile.avatar} alt="Avatar" />
                <AvatarFallback className="text-3xl bg-gray-200 dark:bg-gray-700">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="mt-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
              {profile.nick_name && (
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">@{profile.nick_name}</p>
              )}
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-200 text-center">
              {profile.bio || <span className="italic text-gray-400 dark:text-gray-500">No bio provided.</span>}
            </div>
            {/* Social link icons */}
            {/* Social link icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap justify-center">
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
          </div>
        </Card>

        {/* Main Profile Info */}
        <Card className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardHeader className="p-6 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaUser className="text-indigo-600 dark:text-indigo-400" size={20} /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ProfileInfo icon={<FaUser className="text-indigo-600 dark:text-indigo-400" />} label="Full Name" value={profile.fullName} />
            <ProfileInfo icon={<FaUser className="text-indigo-600 dark:text-indigo-400" />} label="Username" value={profile.username} />
            <ProfileInfo icon={<FaEnvelope className="text-indigo-600 dark:text-indigo-400" />} label="Email" value={profile.email} />
            <ProfileInfo icon={<FaBirthdayCake className="text-indigo-600 dark:text-indigo-400" />} label="Birthday" value={profile.birthday || "Not updated"} />
            <ProfileInfo icon={<FaCalendarAlt className="text-indigo-600 dark:text-indigo-400" />} label="Member Since" value={profile.memberSince} />
            <ProfileInfo icon={<FaUserShield className="text-indigo-600 dark:text-indigo-400" />} label="Verification Status" value={profile.is_verified ? "Verified" : "Not verified"} />
            {/* Social networks (full link) */}
            {socialLinks.length > 0 && (
              <div className="col-span-1 sm:col-span-2">
                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <FaGlobe className="text-indigo-600 dark:text-indigo-400" /> Social Networks
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socialLinks.map(({ name, link }) => {
                    const Icon = SOCIAL_NETWORKS_ICON[name] || FaGlobe;
                    return (
                      <ProfileInfo
                        key={name + link}
                        icon={<Icon className="text-indigo-600 dark:text-indigo-400" />}
                        label={capitalizeFirstLetter(name)}
                        value={
                          <a
                            href={link.startsWith("http") ? link : `https://${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                          >
                            {link}
                          </a>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 ${className}`}
    >
      {icon && (
        <span className="text-lg mt-1">{icon}</span>
      )}
      <div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</div>
        <div className="text-base text-gray-900 dark:text-white">{value}</div>
      </div>
    </motion.div>
  );
}

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
    <motion.a
      whileHover={{ scale: 1.1 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-10 h-10 rounded-full ${color} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200`}
      title={label}
    >
      {icon}
    </motion.a>
  )
}

function getSocialColor(name: string) {
  switch (name) {
    case "facebook": return "text-blue-600 dark:text-blue-400";
    case "twitter": return "text-sky-500 dark:text-sky-300";
    case "linkedin": return "text-sky-700 dark:text-sky-400";
    case "instagram": return "text-pink-600 dark:text-pink-400";
    case "github": return "text-gray-700 dark:text-gray-100";
    default: return "text-indigo-600 dark:text-indigo-400";
  }
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}