'use client'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useState } from 'react'
import { UserManagement } from './users'
import { RolesManagement } from './roles'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import { useAppSelector } from '@/hooks/reduxHooks'
import { UserRoleManagement } from './UserRoleManagement'
import { RolePermissionManagement } from './RolePermissionManagement'
import { PermissionManagement } from './Permissions'

export function UserManagementTabs() {
  const { user } = useAppSelector((state) => state.auth)
  const [tab, setTab] = useState<
    'users' | 'roles-permissions' | 'user_roles' | 'role_permissions' | 'permissions'
  >('users')

  return (
    <div className="w-full">
      <WelcomeBanner name={user?.user_name} />

      <Tabs value={tab} onValueChange={(val) => setTab(val as any)}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex flex-wrap gap-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles-permissions">Roles</TabsTrigger>
            <TabsTrigger value="user_roles">User Roles</TabsTrigger>
            <TabsTrigger value="role_permissions">Role Permissions</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* 👇 Render component theo từng tab */}
      <div className="mt-4">
        {tab === 'users' && <UserManagement />}
        {tab === 'roles-permissions' && <RolesManagement />}
        {tab === 'user_roles' && <UserRoleManagement />}
        {tab === 'role_permissions' && <RolePermissionManagement />}
        {tab === 'permissions' && <PermissionManagement />}
      </div>
    </div>
  )
}
