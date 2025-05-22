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
import { updateTeam, uploadTeamAvatar } from "@/apis/team-api";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/reduxHooks";
import AvatarUploadCard2 from "@/components/common/AvatarUploadCard2";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { AvatarGroup } from "@/components/AvatarGroup";
import { AvatarUser } from "@/components/AvatarUser";
import { Team } from "../types";
import { X } from "lucide-react";
import { IoCreateOutline } from "react-icons/io5";

// --- props type ---
interface FormEditTeamProps {
    team: Team;
    mode?: "edit" | "show";
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function FormShowEditTeam({
    team,
    mode = "edit",
    onSuccess,
    onCancel
}: FormEditTeamProps) {
    const isShow = mode === "show";

    // State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [subProject, setSubProject] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);

    const [subProjects, setSubProjects] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

    const { user } = useAppSelector((state) => state.auth);
    const adminId = user?.id;

    // Avatar
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(
        team?.mediaAvatar?.url ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.user_name}`
    );

    useEffect(() => {
        if (team) {
            setName(team.name || "");
            setDescription(team.description || "");
            setSubProject(team.sub_project_id ? String(team.sub_project_id) : "");
            setSelectedMembers(
                team.members
                    ? team.members
                        .filter((m: { user: { id: number } }) => m.user.id !== adminId)
                        .map((m) => m.user.id)
                    : []
            );
            setAvatarPreview(team?.mediaAvatar?.url || avatarPreview);
            setDisable(false);
        }
        // eslint-disable-next-line
    }, [team, adminId, subProject]);

    // Upload avatar
    const handleUpload = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        getSubProjects().then((res) => setSubProjects(res?.data || []));
        getUsers().then((res) => {
            const list = (res?.data || []).filter((u) => u.id !== adminId);
            setUsers(list);
        });
    }, [adminId]);

    const memberOptions = users.map((u) => ({
        value: u.id,
        label: u.user_name || u.name
    }));

    const handleMembersChange = (selected: any) => {
        if (isShow) return; // không cho chọn
        const newIds = selected ? selected.map((opt: any) => opt.value) : [];
        setSelectedMembers(newIds);
        setDisable(newIds.length < 1);
    };

    const selectedMemberOptions = memberOptions.filter((opt) =>
        selectedMembers.includes(opt.value)
    );

    // Submit (UPDATE)
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateTeam(team.id, {
                name,
                description,
                sub_project_id: subProject ? parseInt(subProject) : undefined,
                user_ids: [...selectedMembers, adminId], // Nếu BE có nhận sửa member
            });

            if (res.ok) {
                if (avatarFile) {
                    await uploadTeamAvatar(avatarFile, team.id);
                }
                toast.success("Updated team successfully");
                onSuccess && onSuccess();
            } else {
                toast.error("Update failed");
            }
        } catch (err) {
            toast.error("Error updating team");
        } finally {
            setLoading(false);
        }
    };

    // ---- UI ----
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 ">
                    <AvatarUploadCard2
                        avatarUrl={avatarPreview}
                        onUpload={isShow ? undefined : handleUpload}
                        disabled={isShow}
                    />
                    {
                        isShow && (<>
                            <span className="italic text-sm text-muted-foreground">{description}</span>
                        </>)
                    }
                </div>
                <div className="col-span-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Team name */}
                        <div>
                            <label className="block mb-1 text-left text-form-title">
                                Team name<span className="text-red-500">*</span>
                            </label>
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter team name"
                                disabled={isShow}
                            />
                        </div>
                        {/* Sub-project */}
                        <div>
                            <label className="block mb-1 text-left text-form-title">
                                Sub-project<span className="text-red-500">*</span>
                            </label>
                            <UiSelect
                                value={subProject}
                                onValueChange={isShow ? undefined : setSubProject}
                                required
                                disabled={isShow}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sub-project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subProjects.map((sp) => (
                                        <SelectItem key={sp.id} value={String(sp.id)} className="px-2 py-2">
                                        <div className="flex w-full justify-between items-center">
                                            <span>{sp.name}</span>
                                            <span className="text-xs text-muted-foreground ml-2">#{sp.id}</span>
                                        </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </UiSelect>
                        </div>
                    </div>

                    {
                        mode === 'edit' && (
                            <>
                                {/* Description */}
                                <div>
                                    <label className="block mb-1 text-left text-form-title">
                                        Description
                                    </label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter description"
                                        readOnly={isShow}
                                        disabled={isShow}
                                    />
                                </div>
                            </>
                        )
                    }

                    {/* Team Members */}
                    <div>
                        <label className="block mb-1 text-left text-form-title">
                            Team Members <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={memberOptions}
                            isMulti
                            value={selectedMemberOptions}
                            onChange={handleMembersChange}
                            placeholder="Select team members..."
                            className=""
                            isDisabled={isShow}
                        />
                        {selectedMembers.length === 0 && (
                            <div className="text-sm text-muted-foreground italic">
                                Select at least two member (besides leader).
                            </div>
                        )}
                        <div className="pt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-form-title">Admin:</span>
                                <AvatarUser
                                    img={user?.picture}
                                    name={user?.user_name}
                                    size="md"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-form-title">Members:</span>
                                <AvatarGroup
                                    members={
                                        selectedMembers
                                            .map((id) =>
                                                users.find((u) => u.id === id)
                                                    ? {
                                                        name:
                                                            users.find((u) => u.id === id)
                                                                ?.user_name ||
                                                            users.find((u) => u.id === id)
                                                                ?.name ||
                                                            "",
                                                        picture: users.find((u) => u.id === id)
                                                            ?.picture,
                                                    }
                                                    : { name: String(id) }
                                            )
                                    }
                                    maxDisplay={3}
                                />
                                {selectedMembers.length === 0 && (
                                    <span className="italic text-muted-foreground text-sm">
                                        No member selected.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Actions */}
            {!isShow && (
                <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                    <Button
                        className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_DELETE}`}
                        type="button"
                        onClick={onCancel}
                    >
                         <X className="mr-1 " />
                        Cancel
                    </Button>
                    <Button
                        className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`}
                        type="submit"
                        disabled={loading || disable}
                    >
                         <IoCreateOutline />
                        {loading ? "Updating..." : "Update Team"}
                    </Button>
                </div>
            )}
        </form>
    );
}
