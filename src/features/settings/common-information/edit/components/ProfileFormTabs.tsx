import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ProfileUserForm } from './ProfileUserForm'

export function ProfileFormTabs({ profile }: { profile: any }) {
  return (
    <Card className="w-full rounded-3xl shadow-2xl border-0 bg-white dark:bg-zinc-900 p-0 overflow-hidden">
      <CardHeader className="pb-2 pt-8 px-10">
        <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-12 px-10">
        <Tabs defaultValue="user-info" className="">
          <TabsList className="mb-8 bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="user-info" className="text-lg">User Info</TabsTrigger>
            <TabsTrigger value="billing" disabled className="text-lg">
              Billing Information
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user-info">
            <ProfileUserForm profile={profile} />
          </TabsContent>
          <TabsContent value="billing">
            <div className="text-zinc-400 dark:text-zinc-400 text-lg">Billing tab content (disabled).</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
