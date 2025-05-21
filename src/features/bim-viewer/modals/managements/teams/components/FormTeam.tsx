import { useEffect, useState } from "react";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSubProjects } from "@/apis/sub-project-api";
import { getUsers } from "@/apis/user-api";
import { createTeam, updateTeam, uploadTeamAvatar } from "@/apis/team-api";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/reduxHooks";
import AvatarUploadCard2 from "@/components/common/AvatarUploadCard2";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

export function FormTeam({
  team,          // team object nếu là edit
  onSuccess,
  onCancel,
}) {
  // State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subProject, setSubProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);

  const [subProjects, setSubProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]); // array of user id

  const { user } = useAppSelector((state) => state.auth);
  const adminId = user?.id;

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    team?.avatar ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.user_name}`
  );

  // Fill form nếu là edit
  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setDescription(team.description || "");
      setSubProject(team.sub_project_id ? String(team.sub_project_id) : "");
      setSelectedMembers(
        team.members
          ? team.members.filter((m) => m.user_id !== adminId).map((m) => m.user_id)
          : []
      );
      setAvatarPreview(team.avatar || avatarPreview);
      setDisable(false);
    }
    // eslint-disable-next-line
  }, [team, adminId]);

  // Upload avatar
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Cleanup preview URL khi unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    getSubProjects().then(res => setSubProjects(res?.data || []));
    getUsers().then(res => {
      // Loại admin khỏi danh sách member (vì mặc định là Leader)
      const list = (res?.data || []).filter(u => u.id !== adminId);
      setUsers(list);
    });
  }, [adminId]);

  // Options cho react-select
  const memberOptions = users.map(u => ({
    value: u.id,
    label: u.user_name || u.name
  }));

  // Khi thay đổi danh sách member
  const handleMembersChange = (selected) => {
    const newIds = selected ? selected.map(opt => opt.value) : [];
    setSelectedMembers(newIds);
    setDisable(newIds.length < 1); // Cần ít nhất 1 (cộng với Leader là đủ 2)
  };

  const selectedMemberOptions = memberOptions.filter(opt => selectedMembers.includes(opt.value));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let teamId = team?.id;
      if (team) {
        // UPDATE
        const res = await updateTeam(team.id, {
          name,
          description,
          sub_project_id: subProject ? parseInt(subProject) : undefined,
        });
        if (res.ok) {
          toast.success("Updated team successfully");
          teamId = team.id;
        } else {
          toast.error("Update failed");
          setLoading(false);
          return;
        }
      } else {
        // CREATE
        const res = await createTeam({
          name,
          description,
          sub_project_id: subProject ? parseInt(subProject) : undefined,
          owner_id: adminId,
          created_by: adminId,
          user_ids: [...selectedMembers, adminId]
        });
        if (res.ok) {
          toast.success("Created team successfully");
          teamId = res.data.id;
        } else {
          toast.error("Create failed");
          setLoading(false);
          return;
        }
      }
      // Upload avatar nếu có đổi
      if (avatarFile && teamId) {
        await uploadTeamAvatar(avatarFile, teamId);
      }
      onSuccess && onSuccess();
    } catch (err) {
      toast.error("Error saving team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <AvatarUploadCard2 avatarUrl={avatarPreview} onUpload={handleUpload} />
        </div>
        <div className="col-span-8 space-y-4">
          {/* Team name & sub-project */}
          <div className="grid grid-cols-2 gap-4">
            {/* Team name */}
            <div>
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
            <div>
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
          {/* Team Members */}
          <div>
            <label className="block mb-1 font-medium text-left">Team Members</label>
            <Select
              options={memberOptions}
              isMulti
              value={selectedMemberOptions}
              onChange={handleMembersChange}
              placeholder="Select team members..."
              className="mb-2 text-gray-600 bg-slate-700"
            />
            {selectedMembers.length === 0 && (
              <div className="text-sm text-muted-foreground italic">
                Select at least one member (besides leader).
              </div>
            )}
            {/* Hiển thị leader & member */}
            {selectedMembers.length > 0 && (
              <div className="space-y-1 pt-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-semibold">Leader:</span>{" "}
                  {user?.user_name || "Admin (you)"}
                </div>
                <div>
                  <span className="font-semibold">Members:</span>{" "}
                  {selectedMembers.map(userId => {
                    const u = users.find(u => u.id === userId);
                    return (
                      <span key={userId} className="inline-block mr-2">
                        {u?.user_name || u?.name || userId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_DELETE}`} type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`}
          type="submit"
          disabled={loading || disable}
        >
          {loading ? (team ? "Updating..." : "Creating...") : team ? "Update Team" : "Create Team"}
        </Button>
      </div>
    </form>
  );
}
