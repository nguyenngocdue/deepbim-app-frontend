import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default function ShowProfile() {
  const profile = {
    fullName: 'Jamed Allan',
    username: 'Allan',
    email: 'demoemail@mail.com',
    avatar: '/avatars/01.png',
    memberSince: '29 September 2019',
    social: {
      facebook: 'james.fb',
      twitter: 'james.tw',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-200 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl">
        {/* Card trái: Avatar + Info */}
        <Card className="w-full md:w-[400px] max-w-sm rounded-3xl shadow-2xl border-0 bg-white flex-shrink-0 p-0 overflow-hidden">
          <CardHeader className="flex flex-col items-center py-10">
            <Avatar className="w-36 h-36 mb-6 shadow-lg border-4 border-white bg-zinc-200">
              <AvatarImage src={profile.avatar} alt="Avatar" />
              <AvatarFallback className="text-4xl">
                {profile.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center text-2xl font-semibold text-zinc-900 mb-2">
              {profile.fullName}
            </CardTitle>
            <p className="text-zinc-400 text-lg text-center mb-4">
              @{profile.username}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-10">
            <div className="bg-zinc-100 rounded-xl p-4 text-base text-center text-zinc-600 w-full mb-2">
              Member Since: <span className="font-semibold">{profile.memberSince}</span>
            </div>
            <div className="flex gap-4 mt-1">
              <a
                href={`https://facebook.com/${profile.social.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-base"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/${profile.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline text-base"
              >
                Twitter
              </a>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="mt-6 w-full text-base border-2 border-zinc-200 shadow-sm hover:bg-zinc-100"
              onClick={() => alert('Đi đến trang Chỉnh sửa hồ sơ')}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Card phải: Profile Details dạng read-only */}
        <Card className="w-full md:w-[700px] max-w-3xl rounded-3xl shadow-2xl border-0 bg-white p-0 overflow-hidden">
          <CardHeader className="pb-2 pt-8 px-10">
            <CardTitle className="text-3xl font-bold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-12 px-10">
            <Tabs defaultValue="user-info" className="">
              <TabsList className="mb-8 bg-zinc-100">
                <TabsTrigger value="user-info" className="text-lg">User Info</TabsTrigger>
                <TabsTrigger value="billing" disabled className="text-lg">
                  Billing Information
                </TabsTrigger>
              </TabsList>
              <TabsContent value="user-info">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileInfo label="Full Name" value={profile.fullName} />
                    <ProfileInfo label="Username" value={profile.username} />
                    <ProfileInfo label="Email Address" value={profile.email} />
                    <ProfileInfo label="Confirm Email Address" value={profile.email} />
                    <ProfileInfo label="Password" value="********" />
                    <ProfileInfo label="Confirm Password" value="********" />
                  </div>
                  <div className="mt-6">
                    <div className="block mb-3 text-lg font-medium">
                      Social Profile
                    </div>
                    <div className="flex gap-4">
                      <ProfileInfo label="Facebook" value={profile.social.facebook} className="flex-1" />
                      <ProfileInfo label="Twitter" value={profile.social.twitter} className="flex-1" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="billing">
                <div className="text-zinc-400 text-lg">Billing tab content (disabled).</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component nhỏ cho dòng thông tin
function ProfileInfo({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1 text-lg font-semibold text-zinc-700">{label}</div>
      <div className="px-4 py-3 bg-zinc-100 rounded-xl text-lg text-zinc-800 border border-zinc-200">
        {value}
      </div>
    </div>
  )
}
