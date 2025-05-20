import { useEffect, useState } from "react";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSubProjects } from "@/apis/sub-project-api";
import { getUsers } from "@/apis/user-api";
import { createTeam } from "@/apis/team-api";
import { addTeamMembers } from "@/apis/team-member-api";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/reduxHooks";

interface FormCreateTeamProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  fetchTeams: () => void;
}

export function FormCreateTeam({ onSuccess, onCancel, fetchTeams }: FormCreateTeamProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subProject, setSubProject] = useState("");
  const [loading, setLoading] = useState(false);

  const [subProjects, setSubProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // array of user id

   const { user } = useAppSelector((state) => state.auth);
   const adminId = user?.id;



  useEffect(() => {
    getSubProjects().then(res => setSubProjects(res?.data || []));
    getUsers().then(res => {
      // Loại admin khỏi danh sách member (vì mặc định là Leader)
      const list = (res?.data || []).filter(u => u.id !== adminId);
      setUsers(list);
    });
  }, []);

  // Options cho react-select (chỉ là member, không có admin)
  const memberOptions = users.map(u => ({
    value: u.id,
    label: u.user_name || u.name
  }));

  // Khi thay đổi danh sách member
  const handleMembersChange = (selected) => {
    const newIds = selected ? selected.map(opt => opt.value) : [];
    setSelectedMembers(newIds);
  };

  const selectedMemberOptions = memberOptions.filter(opt => selectedMembers.includes(opt.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Tạo team: admin là owner_id
      const res = await createTeam({
        name,
        description,
        sub_project_id: subProject ? parseInt(subProject) : undefined,
        owner_id: adminId,
        created_by: adminId,
        user_ids: selectedMembers
      });
      console.log(res);
      if(res.ok) {
        toast.success("Created team successfully");
      }
      // 2. Add member: admin là Leader, những người còn lại là Member
      if (res?.data?.id) {
        await addTeamMembers({
          team_id: res.data.id,
          members: [
            // Thêm admin với role Leader
            { user_id: adminId, role: "Leader" },
            // Những người còn lại là Member
            ...selectedMembers.map(userId => ({
              user_id: userId,
              role: "Member"
            }))
          ]
        });
      }

      toast.success("Created user team successfully");
      onSuccess && onSuccess();
      fetchTeams();
    } catch (err) {
      toast.error("Error creating team");
    } finally {
      setLoading(false);
    }
  };

return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Team name */}
        <div className="col-span-6">
          <label className="block mb-1 font-medium text-left">
            Team name<span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter team name"
          />
        </div>
        {/* Sub-project */}
        <div className="col-span-6">
          <label className="block mb-1 font-medium text-left">
            Sub-project<span className="text-red-500">*</span>
          </label>
          <UiSelect value={subProject} onValueChange={setSubProject} required>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-project" />
            </SelectTrigger>
            <SelectContent>
              {subProjects.map(sp => (
                <SelectItem key={sp.id} value={String(sp.id)}>
                  {sp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </UiSelect>
        </div>
      </div>
      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-left">Description</label>
        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      
      {/* Team Members dùng react-select */}
      <div>
        <label className="block mb-1 font-medium text-left">Team Members</label>
        <Select
          options={memberOptions}
          isMulti
          value={selectedMemberOptions}
          onChange={handleMembersChange}
          placeholder="Select team members..."
          className="mb-2"
        />
        {selectedMembers.length === 0 && (
          <div className="text-sm text-muted-foreground italic">
            Select at least one member.
          </div>
        )}
        {/* Hiển thị danh sách thành viên sẽ tạo */}
        {selectedMembers.length > 0 && (
          <div className="space-y-1 pt-2 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold">Leader:</span>{" "}
              {users.find(u => u.id === adminId)?.user_name || "Admin (you)"}
            </div>
            <div>
              <span className="font-semibold">Members:</span>{" "}
              {selectedMembers.map(userId => {
                const user = users.find(u => u.id === userId);
                return (
                  <span key={userId} className="inline-block mr-2">
                    {user?.user_name || user?.name || userId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Team"}
        </Button>
      </div>
    </form>
  );
}
