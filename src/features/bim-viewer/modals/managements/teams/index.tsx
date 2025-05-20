import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityListLayout } from "../components/EntityListLayout"
import { FormCreateTeam } from "./components/FormCreateTeam"
import TeamTable, { TeamRow } from "./components/TeamTable"

// Mock data mẫu, sau này bạn fetch từ API thì chỉ cần thay data
const MOCK_TEAMS: TeamRow[] = [
  {
    id: 1,
    name: "Frontend Devs",
    description: "All frontend developers",
    owner: { id: 100, name: "Nguyen Van A" },
    members_count: 4,
    created_at: "2024-05-18",
  },
  {
    id: 2,
    name: "Backend Devs",
    description: "Backend & API",
    owner: { id: 101, name: "Tran Van B" },
    members_count: 6,
    created_at: "2024-05-19",
  },
  {
    id: 3,
    name: "QA Team",
    description: "Testing everything",
    owner: { id: 102, name: "Pham Thi C" },
    members_count: 2,
    created_at: "2024-05-20",
  }
]

const TeamPage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("")

  // Filter teams theo tên (search)
  const teams = MOCK_TEAMS.filter(team =>
    team.name.toLowerCase().includes(filter.toLowerCase()) ||
    team.description.toLowerCase().includes(filter.toLowerCase()) ||
    (team.owner?.name ?? "").toLowerCase().includes(filter.toLowerCase())
  )

  // Dialog tạo mới team
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
        onSuccess={() => setOpen(false)}
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
      <Button variant="outline">🔍</Button>
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
      countInfo={`Showing ${teams.length} teams`}
    >
      {teams.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No teams to display.
        </div>
      ) : (
        <TeamTable data={teams} />
      )}
    </EntityListLayout>
  )
}

export default TeamPage
