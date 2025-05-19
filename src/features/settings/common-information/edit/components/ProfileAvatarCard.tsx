import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

type ProfileAvatarCardProps = {
  avatarUrl: string;               // URL để preview (có thể là file cũ, hoặc blob mới)
  setAvatarUrl: (url: string) => void;
  avatarFile: File | null;         // File object khi user chọn ảnh mới
  setAvatarFile: (file: File | null) => void;
  fullName: string;
  email: string;
  bio: string;
  setBio: (bio: string) => void;
  memberSince: string;
}

export function ProfileAvatarCard({
  avatarUrl,
  setAvatarUrl,
  avatarFile,
  setAvatarFile,
  fullName,
  email,
  bio,
  setBio,
  memberSince,
}: ProfileAvatarCardProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)         // Để preview
      setAvatarFile(file)       // Để submit lên BE
    }
  }


  return (
    <Card className="w-full md:w-[370px] max-w-sm rounded-3xl shadow-2xl border-0 bg-white dark:bg-zinc-900 flex-shrink-0 overflow-hidden">
      <CardHeader className="flex flex-col items-center py-10">
        <Avatar className="w-32 h-32 mb-6 shadow-lg border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800">
          <AvatarImage src={avatarUrl} alt="Avatar" />
        </Avatar>
        <CardTitle className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          {fullName}
        </CardTitle>
        <p className="text-zinc-400 dark:text-zinc-400 text-lg text-center mb-4">{email}</p>
        <textarea
          placeholder="Bio"
          className="w-full px-4 py-3 text-base rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 min-h-[60px] resize-none"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={200}
        />
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
          className="bg-red-500 hover:bg-red-600 w-full text-base font-semibold mb-4 rounded-xl py-3"
          onClick={() => fileRef.current?.click()}
          type="button"
          size="lg"
        >
          Upload New Photo
        </Button>
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 text-sm text-center text-zinc-600 dark:text-zinc-300 mb-3 w-full">
          Upload a new avatar. Larger image will be resized.<br />
          Maximum upload size is 1MB.
        </div>
        <div className="text-base text-zinc-400 dark:text-zinc-500">
          Member Since: <span className="font-semibold">{memberSince}</span>
        </div>
      </CardContent>
    </Card>
  )
}
