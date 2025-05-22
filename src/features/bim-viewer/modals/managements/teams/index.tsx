"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogTemplate } from "@/components/model-table/DialogTemplate"
import { EntityListLayout } from "../components/EntityListLayout"
import { FormCreateTeam } from "./components/FormCreateTeam"
import TeamTable from "./components/TeamTable"
import { useAppSelector } from "@/hooks/reduxHooks"
import { useTeamsByUser } from "../team-chat/hooks/useTeamsByUser"
import EmptyState from "@/components/common/EmptyState"
import { LoadingState } from "@/components/common/LoadingState"
import { CLASS_NAME_DEFAULT } from "@/utils/class"
import { FormShowEditTeam } from "./components/FormShowEditTeam"
import { Team } from "./types"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"
import { deleteTeam } from "@/apis/team-api"
import { toast } from "sonner"
import { SearchBox } from "@/components/SearchBox"

const TeamPage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState("")
  const { user } = useAppSelector((state) => state.auth);
  const { teams, loading, refresh } = useTeamsByUser(user);
  const [openEdit, setOpenEdit] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedRow, setSelectedRow] = useState<object | null>(null);

  // Xử lý filter real-time (nếu team có thuộc tính .name)
  const filteredTeams = filter
    ? teams.filter(team => team?.name?.toLowerCase().includes(filter.toLowerCase()))
    : teams

  const handleEdit = (data: object) => {
    setSelectedRow(data);
    setOpenEdit(true);
  }

  const handleShow = (data: object) => {
    setSelectedRow(data);
    setOpenShow(true);
  }

  const handleDeleteTeam = (data: object) => {
    setSelectedRow(data);
    setOpenDelete(true);
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
      iconType="create"
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
      <SearchBox
        value={filter}
        onChange={setFilter}
        placeholder="Search team by name or number..."
      />
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
          <TeamTable data={filteredTeams} onEdit={handleEdit} onView={handleShow} onRemove={handleDeleteTeam} /> : <EmptyState />
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
          iconType="edit"
        >
          <FormShowEditTeam
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
          onClose={() => setOpenShow(false)}
          title="Show Team"
          description="Show details for this team."
          disableOutsideClose
          className="max-w-2xl"
          iconType="show"
        >
          <FormShowEditTeam
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


      {/* DELETE */}
      {
        openDelete && (
          <>
            <ConfirmDeleteDialog open={openDelete} onClose={() => setOpenDelete(false)} onConfirm={
              async () => {
                if (selectedRow && (selectedRow as any).id) {
                  const teamId = (selectedRow as any).id;
                  const res = await deleteTeam(teamId);
                  if (res.ok) {
                    toast.success('Team was deleted successfully.')
                    refresh();
                  } else {
                    toast.error("Failed to delete the team. Please try again.")
                  }
                }
                setOpenDelete(false);
              }} />
          </>
        )
      }

    </>
  )

}

export default TeamPage
