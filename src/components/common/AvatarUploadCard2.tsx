// src/components/common/AvatarUploadCard.jsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CLASS_NAME_DEFAULT } from "@/utils/class";

type AvatarUploadCard2Props = {
  avatarUrl?: string;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  note?: string;
  hasAvatar?: boolean;
};

export default function AvatarUploadCard2({
  avatarUrl,
  hasAvatar = true,
  onUpload,
  note = "Upload a new avatar. Larger image will be resized. Maximum upload size is 1MB.",
}: AvatarUploadCard2Props) {
  const fileRef = useRef(null);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Avatar tròn */}
      {
        hasAvatar &&
        <div className="relative">
          <img
            src={avatarUrl || "/avatars/default.png"}
            className="w-28 h-28 rounded-full border-4 border-white shadow object-cover"
            alt="Avatar Preview"
          />
        </div>
      }
      {/* Upload button */}

      {
        onUpload && (
          <>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileRef}
              onChange={onUpload}
            />
            <Button
              className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_UPLOAD}`}
              onClick={() => fileRef.current?.click()}
              type="button"
              size="lg"
            >
              Upload New Photo
            </Button>
            {/* Note */}
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-sm text-center text-zinc-600 dark:text-zinc-300 w-full">
              {note}
            </div>
          </>
        )
      }
    </div>
  );
}
