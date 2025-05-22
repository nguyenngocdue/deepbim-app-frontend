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
import { createTeam, uploadTeamAvatar } from "@/apis/team-api";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/reduxHooks";
import AvatarUploadCard2 from "@/components/common/AvatarUploadCard2";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Trash, X } from "lucide-react";
import { IoCreateOutline } from "react-icons/io5";
import { FormActionButtons } from "@/components/bim-viewer/common/FormActionButtons";

interface FormCreateTeamProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FormCreateTeam({ onSuccess, onCancel }: FormCreateTeamProps) {
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

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.user_name}`);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Nếu muốn clear preview khi submit xong
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);



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
    if (newIds.length > 1) {
      setDisable(false)
    }
  };

  const selectedMemberOptions = memberOptions.filter(opt => selectedMembers.includes(opt.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await createTeam({
      name,
      avatar_temp: avatarPreview,
      description,
      sub_project_id: subProject ? parseInt(subProject) : undefined,
      owner_id: adminId,
      created_by: adminId,
      user_ids: [...selectedMembers, adminId]
    });
    if (res.ok) {
      // apply avatar
      if(avatarFile){
        await uploadTeamAvatar(avatarFile, res.data.id)
      }
      toast.success("Created team successfully");
      onSuccess && onSuccess();
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          {/* Avatar + Upload (bên trái như hình mẫu) */}
          <AvatarUploadCard2 avatarUrl={avatarPreview} onUpload={handleUpload} />
        </div>
        <div className="col-span-8 space-y-4">
          {/* Team name & sub-project */}
          <div className="grid grid-cols-2 gap-4">
            {/* Team name */}
            <div>
              <label className="block mb-1 text-form-title text-left">
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
              <label className="block mb-1 text-form-title text-left">
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
            <label className="block mb-1 text-form-title text-left">Description</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          {/* Team Members */}
          <div>
            <label className="block mb-1 text-form-title text-left">Team Members</label>
            <Select
              options={memberOptions}
              isMulti
              value={selectedMemberOptions}
              onChange={handleMembersChange}
              placeholder="Select team members..."
              className=""
            />
            {selectedMembers.length === 0 && (
              <div className="text-sm text-muted-foreground italic">
                Select at least two members.
              </div>
            )}
            {/* Hiển thị leader & member */}
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
        </div>
      </div>
      {/* Actions */}
      <FormActionButtons
        onCancel={onCancel ?? (() => {})}
        onCancelText="Cancel"
        onApplyText="Create Team"
        applyType="submit"  
        disabled={disable}
        loading={loading}
        onApplyIcon={<IoCreateOutline />}
        classNameDelete={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_DELETE}
        classNameApply={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}
      />
    </form>
  );
}