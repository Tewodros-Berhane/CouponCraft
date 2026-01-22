import api from "../apiClient";

export const useUploadAsset = () => {
  const requestUploadUrl = async (file) => {
    const { data } = await api.post("/uploads/sign", {
      filename: file.name,
      contentType: file.type,
    });

    return {
      uploadUrl: data?.uploadUrl,
      assetUrl: data?.assetUrl,
      contentType: data?.contentType,
    };
  };

  const uploadAsset = async (uploadUrl, file) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }
  };

  return { requestUploadUrl, uploadAsset };
};
