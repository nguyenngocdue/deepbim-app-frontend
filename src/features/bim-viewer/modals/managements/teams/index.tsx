"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityListLayout } from "../components/EntityListLayout"
import { FormCreateTeam } from "./components/FormCreateTeam"
import TeamTable from "./components/TeamTable"
import { getTeamByUserId } from "@/apis/team-api"
import { useAppSelector } from "@/hooks/reduxHooks"

const TeamPage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("")
  const [teams, setTeams] = useState([])
  const { user } = useAppSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  // Hàm fetch team, dùng useCallback để tránh tạo mới mỗi lần render
  const fetchTeams = useCallback(async () => {
    if (!user || !user.id) return
    setLoading(true)
    try {
      const t = await getTeamByUserId(user.id)
      setTeams(t.data)
    } catch (err) {
      setTeams([])
    } finally {
      setLoading(false)
    }
  }, [user])

  // Gọi fetchTeams khi user.id sẵn sàng hoặc khi user thay đổi
  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  // Xử lý filter real-time (nếu team có thuộc tính .name)
  const filteredTeams = filter
    ? teams.filter(team => team?.name?.toLowerCase().includes(filter.toLowerCase()))
    : teams

  // Dialog tạo mới team, khi onSuccess sẽ gọi lại fetchTeams để reload data
  const dialog = (
    <DialogTemplate
      open={open}
      onClose={() => setOpen(false)}
      title="Create New Team"
      description="Fill in the details to create a new team."
      disableOutsideClose
      className="max-w-2xl"
    >
      <FormCreateTeam
        onSuccess={() => {
          setOpen(false)
          fetchTeams()        // Reload teams sau khi tạo mới
        }}
        onCancel={() => setOpen(false)}
      />
    </DialogTemplate>
  )

  // Search bar
  const searchBar = (
    <div className="flex items-center gap-2">
      <Button onClick={() => setOpen(true)}>+ Create Team</Button>
      <Input
        placeholder="Search teams..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-72"
      />
      {/* Button search chỉ để demo, filter realtime luôn */}
      <Button variant="outline" onClick={() => {}}>🔍</Button>
    </div>
  )

  const tabs = [
    { value: "teams", label: "Teams" },
    { value: "templates", label: "Templates" }
  ]

  return (
    <EntityListLayout
      title="Teams"
      description="Manage your project teams."
      tabs={tabs}
      activeTab="teams"
      dialog={dialog}
      searchBar={searchBar}
      countInfo={`Showing ${filteredTeams.length} teams`}
    >
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading teams...</div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No teams to display.
        </div>
      ) : (
        <TeamTable data={filteredTeams} />
      )}
    </EntityListLayout>
  )
}

export default TeamPage
