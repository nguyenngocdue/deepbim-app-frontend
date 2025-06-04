import { fetchWithAuth2 } from "@/api";


export async function getMedia(userId: number) {
    const response = await fetchWithAuth2(`/media/user/${userId}`);
    return response;
}

export async function getMediaById(mediaId: number) {
    const res = await fetchWithAuth2(`/media/${mediaId}`);
    return res;
}

export async function uploadAvatar(data: any) {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("category_type", "user_avatar");
    formData.append("category_id", data.category_id);
    const response = await fetchWithAuth2(`/media/upload-avatar`, {
        method: 'POST',
        body: formData,
    });
    return response;
}

