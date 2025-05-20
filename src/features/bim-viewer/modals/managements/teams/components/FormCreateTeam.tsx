import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getSubProjects } from "@/apis/sub-project-api"
import { getUsers } from "@/apis/user-api"
import { createTeam } from "@/apis/team-api"
import { addTeamMembers } from "@/apis/team-member-api"
import { toast } from "sonner"

const ROLES = [
  { label: "Leader", value: "Leader" },
  { label: "Member", value: "Member" }
]

export function FormCreateTeam({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [subProject, setSubProject] = useState("")
  const [owner, setOwner] = useState("")
  const [loading, setLoading] = useState(false)

  const [subProjects, setSubProjects] = useState<{ id: number, name: string }[]>([])
  const [users, setUsers] = useState<{ id: number, name: string }[]>([])
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [memberRoles, setMemberRoles] = useState<Record<number, string>>({})
  const [searchUser, setSearchUser] = useState("")

  useEffect(() => {
    getSubProjects().then(res => {
      setSubProjects(res?.data || [])
    })
    getUsers().then(res => {
      setUsers(res?.data || [])
    })
  }, [])

  // Khi chọn member, loại bỏ những member bị unselect ra khỏi role map
  const handleMemberChange = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, userId])
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== userId))
      setMemberRoles(prev => {
        const copy = { ...prev }
        delete copy[userId]
        return copy
      })
    }
  }

  const handleRoleChange = (userId: number, role: string) => {
    setMemberRoles(prev => ({
      ...prev,
      [userId]: role
    }))
  }

  // Lọc user theo từ khóa tìm kiếm
const filteredUsers = (users || []).filter(u =>
  typeof u?.name === "string" &&
  u.name.toLowerCase().includes((searchUser ?? "").toLowerCase())
)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await createTeam({
        name,
        description,
        sub_project_id: parseInt(subProject),
        owner_id: owner ? parseInt(owner) : undefined,
      })

      if (res?.data?.id && selectedMembers.length > 0) {
        await addTeamMembers({
          team_id: res.data.id,
          members: selectedMembers.map(userId => ({
            user_id: userId,
            role: memberRoles[userId] || "Member"
          }))
        })
      }

      toast.success("Created team successfully")
      onSuccess && onSuccess()
    } catch (err) {
      toast.error("Error creating team")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Team name */}
      <div>
        <label className="block mb-1 font-medium">Team name<span className="text-red-500">*</span></label>
        <Input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter team name"
        />
      </div>
      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      {/* Sub-project */}
      <div>
        <label className="block mb-1 font-medium">Sub-project<span className="text-red-500">*</span></label>
        <Select value={subProject} onValueChange={setSubProject} required>
          <SelectTrigger>
            <SelectValue placeholder="Select sub-project" />
          </SelectTrigger>
          <SelectContent>
            {subProjects.map(sp => (
              <SelectItem key={sp.id} value={String(sp.id)}>{sp.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Owner */}
      <div>
        <label className="block mb-1 font-medium">Owner</label>
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger>
            <SelectValue placeholder="Select owner (optional)" />
          </SelectTrigger>
          <SelectContent>
            {users.map(u => (
              <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Members */}
      <div>
        <label className="block mb-1 font-medium">Team Members</label>
        <Input
          placeholder="Search team members..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          className="mb-2"
        />
        <div className="grid gap-2 max-h-48 overflow-auto border rounded-md p-2">
          {filteredUsers.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">No users found.</div>
          ) : (
            filteredUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <input
                  id={`user_${u.id}`}
                  type="checkbox"
                  checked={selectedMembers.includes(u.id)}
                  onChange={e => handleMemberChange(u.id, e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`user_${u.id}`} className="cursor-pointer w-40">{u.name}</label>
                {selectedMembers.includes(u.id) && (
                  <Select
                    value={memberRoles[u.id] || "Member"}
                    onValueChange={role => handleRoleChange(u.id, role)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} >{loading ? "Creating..." : "Create Team"}</Button>
      </div>
    </form>
  )
}
