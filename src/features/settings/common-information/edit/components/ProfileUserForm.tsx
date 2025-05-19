import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SocialProfileInputs } from "./SocialProfileInputs";
import { ProfileAvatarCard } from "./ProfileAvatarCard";
import { useEffect, useState } from "react";
import { uploadAvatar } from "@/apis/media-api";
import { toast } from "sonner";
import { updateProfile } from "@/apis/users/UserSettings";


const DEFAULT_PROFILE = {
    avatar: "",
    bio: "",
    full_name: "",
    user_name: "",
    nick_name: "",
    password: "",
    confirm_password: "",
    email: "",
    confirm_email: "",
    social_profiles: [],
};


export function ProfileUserForm({ profile }: { profile: any }) {
    const form = useForm({
        defaultValues: DEFAULT_PROFILE,
    });

    useEffect(() => {
        form.reset({
            ...DEFAULT_PROFILE,
            ...profile,
            password: "",
            confirmPassword: "",
        });
    }, [profile, form]);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bio, setBio] = useState(profile.bio || "");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || "");

    useEffect(() => {
        setAvatarUrl(profile?.avatar);
        setBio(profile?.bio)
    }, [profile])


    const onSubmit = async (data: any) => {
        const result = {
            ...data,
            bio,
        }

        //Save Media
        const avatarData = {
            file: avatarFile,
            category_type: 'user',
            category_id: profile.user_id,
            description: 'avatar'
        }
        if (avatarFile) {
            try {

                const avatarMedia = await uploadAvatar(avatarData);
                if (avatarMedia.ok) {
                    toast.success('Update your avatar success!');
                }
            } catch (error) {
                toast.error('Update your avatar failed!');
            }
        }

        try {
            const profileRes = await updateProfile(result);
            if (profileRes.ok) {
                toast.success('Update profile success!');
                window.location.reload();
            } else {
                toast.success('Update profile failed!');
            }
        } catch (error) {
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-12 w-full">
            {/* Bên trái: avatar card */}
            <ProfileAvatarCard
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                avatarFile={avatarFile}
                setAvatarFile={setAvatarFile}
                fullName={profile.fullName}
                email={profile.email}
                bio={bio}
                setBio={setBio}
                memberSince={profile.member_since}
            />
            <Form {...form}>
                <form
                    className="space-y-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <div className="grid grid-cols-12 md:grid-cols-2 gap-8">
                        <div className="columns-3 ">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="user_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nick_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nickname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nickname" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="columns-2 ">

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Confirm Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="social_profiles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Social Profiles</FormLabel>
                                <FormControl>
                                    <SocialProfileInputs value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="mt-8 bg-red-500 hover:bg-red-600 w-full text-lg font-semibold py-4 rounded-xl shadow"
                        type="submit"
                        size="lg"
                    >
                        Update Info
                    </Button>
                </form>
            </Form>
        </div>
    );
}
