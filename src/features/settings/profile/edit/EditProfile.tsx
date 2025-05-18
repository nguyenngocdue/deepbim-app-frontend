import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRef, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function EditProfilePage() {
  // State cho avatar
  const [avatar, setAvatar] = useState('/avatars/01.png')
  const fileRef = useRef<HTMLInputElement>(null)
  // Fake data
  const memberSince = '29 September 2019'

  // Handle avatar upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatar(url)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-200 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl">
        {/* Profile card left */}
        <Card className="w-full md:w-[400px] max-w-sm rounded-3xl shadow-2xl border-0 bg-white flex-shrink-0 overflow-hidden">
          <CardHeader className="flex flex-col items-center py-10">
            <Avatar className="w-36 h-36 mb-6 shadow-lg border-4 border-white bg-zinc-200">
              <AvatarImage src={avatar} alt="Avatar" />
              <AvatarFallback className="text-4xl">JA</AvatarFallback>
            </Avatar>
            <CardTitle className="text-center text-2xl font-semibold text-zinc-900 mb-2">
              Jamed Allan
            </CardTitle>
            <p className="text-zinc-400 text-lg text-center mb-4">@james</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-10">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileRef}
              onChange={handleUpload}
            />
            <Button
              className="bg-red-500 hover:bg-red-600 w-full text-lg font-semibold mb-4 rounded-xl py-4"
              onClick={() => fileRef.current?.click()}
              type="button"
              size="lg"
            >
              Upload New Photo
            </Button>
            <div className="bg-zinc-100 rounded-xl p-4 text-base text-center text-zinc-600 mb-3 w-full">
              Upload a new avatar. Larger image will be resized.<br />
              Maximum upload size is 1MB.
            </div>
            <div className="text-base text-zinc-400">
              Member Since: <span className="font-semibold">{memberSince}</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile form right */}
        <Card className="w-full md:w-[700px] max-w-3xl rounded-3xl shadow-2xl border-0 bg-white p-0 overflow-hidden">
          <CardHeader className="pb-2 pt-8 px-10">
            <CardTitle className="text-3xl font-bold">Edit Profile</CardTitle>
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
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormInput label="Full Name" defaultValue="James" />
                    <FormInput label="Username" defaultValue="Allan" />
                    <FormInput label="Password" type="password" placeholder="******" />
                    <FormInput label="Confirm Password" type="password" placeholder="******" />
                    <FormInput label="Email Address" type="email" defaultValue="demoemail@mail.com" />
                    <FormInput label="Confirm Email Address" type="email" defaultValue="demoemail@mail.com" />
                  </div>
                  <div className="mt-6">
                    <div className="block mb-3 text-lg font-medium">
                      Social Profile
                    </div>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Facebook Username"
                        className="flex-1 px-4 py-3 text-lg rounded-xl bg-zinc-100"
                        defaultValue=""
                      />
                      <Input
                        placeholder="Twitter Username"
                        className="flex-1 px-4 py-3 text-lg rounded-xl bg-zinc-100"
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-8 bg-red-500 hover:bg-red-600 w-full text-lg font-semibold py-4 rounded-xl shadow"
                    type="submit"
                    size="lg"
                  >
                    Update Info
                  </Button>
                </form>
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

// Input field đẹp, lớn, dùng cho grid trong form
function FormInput({
  label,
  defaultValue = '',
  type = 'text',
  placeholder = '',
}: {
  label: string
  defaultValue?: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block mb-2 text-lg font-medium">{label}</label>
      <Input
        placeholder={placeholder || label}
        defaultValue={defaultValue}
        type={type}
        className="px-4 py-3 text-lg rounded-xl bg-zinc-100"
      />
    </div>
  )
}
