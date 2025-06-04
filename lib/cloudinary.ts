// Cloudinary upload utilities
const CLOUDINARY_CLOUD_NAME = "dtjjcvhut";
const UPLOAD_PRESET_AVATAR = "benkyo-avatar";
const API_BASE = "https://api.cloudinary.com/v1_1/";

export interface CloudinaryUploadResponse {
   public_id: string;
   secure_url: string;
   url: string;
   format: string;
   resource_type: string;
   width: number;
   height: number;
}

export const uploadImageToCloudinary = async (
   file: File
): Promise<CloudinaryUploadResponse> => {
   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", UPLOAD_PRESET_AVATAR);
   formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

   try {
      const response = await fetch(
         `${API_BASE}${CLOUDINARY_CLOUD_NAME}/image/upload`,
         {
            method: "POST",
            body: formData,
         }
      );

      if (!response.ok) {
         throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
   } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
   }
};

export const uploadMultipleImages = async (
   files: File[]
): Promise<CloudinaryUploadResponse[]> => {
   const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
   return Promise.all(uploadPromises);
};
