"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityListLayout } from "../components/EntityListLayout"
import { FormCreateTeam } from "./components/FormCreateTeam"
import TeamTable from "./components/TeamTable"
import { useAppSelector } from "@/hooks/reduxHooks"
import { useTeamsByUser } from "../team-chat/hooks/useTeamsByUser"
import EmptyState from "@/components/common/EmptyState"
import { LoadingState } from "@/components/common/LoadingState"
import { CLASS_NAME_DEFAULT } from "@/utils/class"
import { FormEditTeam } from "./components/FormEditTeam"
import { Team } from "./types"

const TeamPage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("")
  const { user } = useAppSelector((state) => state.auth);
  const { teams, loading, refresh } = useTeamsByUser(user);
  const [openEdit, setOpenEdit] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState<object | null>(null);

  // Xử lý filter real-time (nếu team có thuộc tính .name)
  const filteredTeams = filter
    ? teams.filter(team => team?.name?.toLowerCase().includes(filter.toLowerCase()))
    : teams

  const handleEdit = (data: object) => {
    if (data) {
      setSelectedRow(data);
      setOpenEdit(true);
    }
  }

  const handleShow = (data: object) => {
    console.log("object");
    setSelectedRow(data);
    setOpenShow(true);
  }



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
          refresh();
        }}
        onCancel={() => setOpen(false)}
      />
    </DialogTemplate>
  )

  // Search bar
  const searchBar = (
    <div className="flex items-center gap-2">
      <Button className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`} onClick={() => setOpen(true)}>+ Create A Team</Button>
      <Input
        placeholder="Search teams..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-72"
      />
      {/* Button search chỉ để demo, filter realtime luôn */}
      <Button variant="outline" onClick={() => { }}>🔍</Button>
    </div>
  )

  const tabs = [
    { value: "teams", label: "Teams" },
    { value: "templates", label: "Templates" }
  ]

  return (
    <>
      <EntityListLayout
        title="Teams"
        description="Manage your project teams."
        tabs={tabs}
        activeTab="teams"
        dialog={dialog}
        searchBar={searchBar}
        countInfo={`Showing ${filteredTeams.length} teams`}
      >
        {loading ? <LoadingState /> : filteredTeams.length ?
          <TeamTable data={filteredTeams} onEdit={handleEdit} onView={handleShow} /> : <EmptyState />
        }
      </EntityListLayout>
{/* EDIT */}
      {openEdit && selectedRow &&
        <DialogTemplate
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          title="Edit Team"
          description="Edit details for this team."
          disableOutsideClose
          className="max-w-2xl"
        >
          <FormEditTeam
            team={selectedRow as Team}
            mode="edit"
            onSuccess={() => {
              setOpenEdit(false);
              refresh();
            }}
            onCancel={() => setOpenEdit(false)}
          />

        </DialogTemplate>
      }

{/* SHOW */}
      {openShow && selectedRow &&
        <DialogTemplate
          open={openShow}
          onClose={() => setOpenEdit(false)}
          title="Show Team"
          description="Show details for this team."
          disableOutsideClose
          className="max-w-2xl"
        >
          <FormEditTeam
            team={selectedRow as Team}
            mode="show"
            onSuccess={() => {
              setOpenShow(false);
              refresh();
            }}
            onCancel={() => setOpenShow(false)}
          />

        </DialogTemplate>
      }

    </>

  )
}

export default TeamPage
