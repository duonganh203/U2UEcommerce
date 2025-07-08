"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface ProfileFormData {
   firstName: string;
   lastName: string;
   email: string;
   phoneNumber: string;
   avatar?: string;
   address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
   };
}

export default function ProfilePage() {
   const { data: session, status, update } = useSession();
   const router = useRouter();
   const [formData, setFormData] = useState<ProfileFormData>({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      avatar: "",
      address: {
         street: "",
         city: "",
         state: "",
         zipCode: "",
         country: "",
      },
   });
   const [isLoading, setIsLoading] = useState(false);
   const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
   const [success, setSuccess] = useState("");
   const [errors, setErrors] = useState<string[]>([]);
   const [avatarFile, setAvatarFile] = useState<File | null>(null);
   const [avatarPreview, setAvatarPreview] = useState<string>("");

   useEffect(() => {
      if (status === "loading") return;
      if (!session) {
         router.push("/login");
         return;
      } // Initialize form with session data
      setFormData((prev) => ({
         ...prev,
         firstName: session.user.firstName || "",
         lastName: session.user.lastName || "",
         email: session.user.email || "",
         avatar: session.user.avatar || "",
      }));

      // Set avatar preview if user already has an avatar
      if (session.user.avatar) {
         setAvatarPreview(session.user.avatar);
      }
   }, [session, status, router]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name.startsWith("address.")) {
         const addressField = name.split(".")[1];
         setFormData((prev) => ({
            ...prev,
            address: {
               ...prev.address,
               [addressField]: value,
            },
         }));
      } else {
         setFormData((prev) => ({
            ...prev,
            [name]: value,
         }));
      }

      // Clear messages when user starts typing
      if (errors.length > 0) setErrors([]);
      if (success) setSuccess("");
   };

   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         // Validate file type
         if (!file.type.startsWith("image/")) {
            setErrors(["Please select an image file"]);
            return;
         }

         // Validate file size (max 5MB)
         if (file.size > 5 * 1024 * 1024) {
            setErrors(["Image size should be less than 5MB"]);
            return;
         }

         setAvatarFile(file);
         setErrors([]);

         // Create preview
         const reader = new FileReader();
         reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleRemoveAvatar = () => {
      setAvatarFile(null);
      setAvatarPreview(formData.avatar || "");
      setErrors([]);

      // Reset file input
      const fileInput = document.getElementById("avatar") as HTMLInputElement;
      if (fileInput) {
         fileInput.value = "";
      }
   };

   const uploadAvatar = async (): Promise<string | null> => {
      if (!avatarFile) return formData.avatar || null;

      try {
         setIsUploadingAvatar(true);
         const uploadResult = await uploadImageToCloudinary(avatarFile);
         return uploadResult.secure_url;
      } catch (error) {
         console.error("Avatar upload failed:", error);
         setErrors(["Failed to upload avatar"]);
         return null;
      } finally {
         setIsUploadingAvatar(false);
      }
   };
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors([]);
      setSuccess("");

      try {
         // Upload avatar first if there's a new one
         let avatarUrl: string | undefined = formData.avatar;
         if (avatarFile) {
            const uploadResult = await uploadAvatar();
            if (uploadResult) {
               avatarUrl = uploadResult;
            } else if (avatarFile) {
               // If upload failed and we had a file, stop here
               setIsLoading(false);
               return;
            }
         } // Prepare data for API call
         const updateData = {
            ...formData,
            avatar: avatarUrl || undefined,
         };

         const response = await fetch("/api/profile/update", {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
         }
         const result = await response.json();
         setSuccess("Profile updated successfully!");

         // Update form data with the response
         setFormData(result.user);
         if (result.user.avatar) {
            setAvatarPreview(result.user.avatar);
         }

         // Clear the avatar file since it's now uploaded
         setAvatarFile(null);

         // Update the session with new user data
         await update({
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            avatar: result.user.avatar,
         });
      } catch (error: any) {
         console.error("Profile update error:", error);
         setErrors([
            error.message || "An error occurred while updating your profile.",
         ]);
      } finally {
         setIsLoading(false);
      }
   };
   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (!session) {
      return null;
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-card shadow-xl rounded-2xl border border-border/50 overflow-hidden">
               {/* Header Section */}
               <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background px-6 py-8 border-b border-border/50">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                           Cài đặt hồ sơ
                        </h1>
                        <p className="text-muted-foreground">
                           Quản lý thông tin tài khoản và tuỳ chọn của bạn
                        </p>
                     </div>
                     <Link
                        href="/dashboard"
                        className="inline-flex items-center px-6 py-3 border border-border rounded-xl shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted transition-all duration-200 hover:shadow-md"
                     >
                        ← Quay lại Bảng điều khiển
                     </Link>
                  </div>
               </div>

               <div className="px-8 py-8">
                  {/* Alert Messages */}
                  {errors.length > 0 && (
                     <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
                        <div className="flex items-start">
                           <div className="flex-shrink-0">
                              <X className="h-5 w-5 text-destructive mt-0.5" />
                           </div>
                           <div className="ml-3">
                              <h3 className="text-sm font-medium">
                                 Có lỗi xảy ra khi gửi thông tin:
                              </h3>
                              <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                                 {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>
                  )}

                  {success && (
                     <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl">
                        <div className="flex items-center">
                           <div className="flex-shrink-0">
                              <svg
                                 className="h-5 w-5 text-green-400"
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                              >
                                 <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </div>
                           <div className="ml-3">
                              <p className="text-sm font-medium">{success}</p>
                           </div>
                        </div>
                     </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                     {/* Personal Information Section */}
                     <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                           <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                 className="w-4 h-4 text-primary"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                 />
                              </svg>
                           </div>
                           Thông tin cá nhân
                        </h2>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                           <div className="space-y-2">
                              <Label
                                 htmlFor="firstName"
                                 className="text-sm font-medium text-foreground"
                              >
                                 Tên *
                              </Label>
                              <Input
                                 type="text"
                                 id="firstName"
                                 name="firstName"
                                 value={formData.firstName}
                                 onChange={handleChange}
                                 className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                 placeholder="Nhập tên của bạn"
                              />
                           </div>

                           <div className="space-y-2">
                              <Label
                                 htmlFor="lastName"
                                 className="text-sm font-medium text-foreground"
                              >
                                Họ *
                              </Label>
                              <Input
                                 type="text"
                                 id="lastName"
                                 name="lastName"
                                 value={formData.lastName}
                                 onChange={handleChange}
                                 className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                 placeholder="Nhập họ của bạn"
                              />
                           </div>
                        </div>

                        <div className="mt-6 space-y-2">
                           <Label
                              htmlFor="email"
                              className="text-sm font-medium text-foreground"
                           >
                              Địa chỉ email
                           </Label>
                           <Input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled
                              className="h-12 rounded-lg bg-muted border-muted-foreground/20 text-muted-foreground cursor-not-allowed"
                           />
                           <p className="text-xs text-muted-foreground flex items-center mt-2">
                              <svg
                                 className="w-3 h-3 mr-1"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                 />
                              </svg>
                              Email không thể thay đổi vì lý do bảo mật
                           </p>
                        </div>

                        <div className="mt-6 space-y-2">
                           <Label
                              htmlFor="phoneNumber"
                              className="text-sm font-medium text-foreground"
                           >
                              Số điện thoại
                           </Label>
                           <Input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                              placeholder="+1 (555) 000-0000"
                           />
                        </div>
                     </div>

                     {/* Avatar Section */}
                     <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                           <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                              <Camera className="w-4 h-4 text-primary" />
                           </div>
                           Ảnh đại diện
                        </h2>

                        <div className="flex items-start space-x-6">
                           {/* Avatar Preview */}
                           <div className="relative group">
                              {avatarPreview ? (
                                 <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-border shadow-lg group-hover:shadow-xl transition-all duration-200">
                                    <Image
                                       src={avatarPreview}
                                       alt="Avatar preview"
                                       fill
                                       className="object-cover"
                                    />
                                    {avatarFile && (
                                       <button
                                          type="button"
                                          onClick={handleRemoveAvatar}
                                          className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 shadow-lg transition-all duration-200"
                                          title="Remove avatar"
                                       >
                                          <X className="w-4 h-4" />
                                       </button>
                                    )}
                                 </div>
                              ) : (
                                 <div className="w-24 h-24 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary/50 transition-all duration-200">
                                    <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary/70 transition-colors duration-200" />
                                 </div>
                              )}
                           </div>

                           {/* Upload Controls */}
                           <div className="flex-1 space-y-4">
                              <div className="flex items-center space-x-3">
                                 <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                 />
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="default"
                                    onClick={() =>
                                       document
                                          .getElementById("avatar")
                                          ?.click()
                                    }
                                    disabled={isUploadingAvatar}
                                    className="flex items-center space-x-2 h-12 px-6 rounded-lg border-border hover:bg-muted hover:border-primary/50 transition-all duration-200"
                                 >
                                    {isUploadingAvatar ? (
                                       <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                       <Upload className="w-4 h-4" />
                                    )}
                                    <span>
                                       {avatarFile
                                          ? "Change Avatar"
                                          : "Upload Avatar"}
                                    </span>
                                 </Button>
                                 {avatarPreview && (
                                    <Button
                                       type="button"
                                       variant="outline"
                                       size="default"
                                       onClick={handleRemoveAvatar}
                                       className="h-12 px-6 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/50 transition-all duration-200"
                                    >
                                       Xoá
                                    </Button>
                                 )}
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                 <p className="text-xs text-blue-800 flex items-center">
                                    <svg
                                       className="w-3 h-3 mr-1 flex-shrink-0"
                                       fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24"
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                       />
                                    </svg>
                                    Tải lên ảnh JPG, PNG hoặc GIF. Dung lượng tối đa: 5MB.
                                 </p>
                              </div>
                              {avatarFile && (
                                 <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-xs text-green-800 flex items-center">
                                       <svg
                                          className="w-3 h-3 mr-1 flex-shrink-0"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                       </svg>
                                       Đã chọn: {avatarFile.name}
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Address Section */}
                     <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                           <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                 className="w-4 h-4 text-primary"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                 />
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                 />
                              </svg>
                           </div>
                           Thông tin địa chỉ
                        </h2>

                        <div className="space-y-6">
                           <div className="space-y-2">
                              <Label
                                 htmlFor="address.street"
                                 className="text-sm font-medium text-foreground"
                              >
                                 Địa chỉ
                              </Label>
                              <Input
                                 type="text"
                                 id="address.street"
                                 name="address.street"
                                 value={formData.address.street}
                                 onChange={handleChange}
                                 className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                 placeholder="123 Main Street"
                              />
                           </div>

                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="space-y-2">
                                 <Label
                                    htmlFor="address.city"
                                    className="text-sm font-medium text-foreground"
                                 >
                                    Thành phố
                                 </Label>
                                 <Input
                                    type="text"
                                    id="address.city"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    placeholder="Hà Nội"
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label
                                    htmlFor="address.state"
                                    className="text-sm font-medium text-foreground"
                                 >
                                    Tỉnh/Thành phố
                                 </Label>
                                 <Input
                                    type="text"
                                    id="address.state"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    placeholder="Hà Nội"
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label
                                    htmlFor="address.zipCode"
                                    className="text-sm font-medium text-foreground"
                                 >
                                    Mã bưu điện
                                 </Label>
                                 <Input
                                    type="text"
                                    id="address.zipCode"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={handleChange}
                                    className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    placeholder="10001"
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label
                                    htmlFor="address.country"
                                    className="text-sm font-medium text-foreground"
                                 >
                                    Quốc gia
                                 </Label>
                                 <Input
                                    type="text"
                                    id="address.country"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    className="h-12 rounded-lg border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                    placeholder="United States"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Submit Button */}
                     <div className="flex justify-end pt-6 border-t border-border/50">
                        <Button
                           type="submit"
                           disabled={isLoading}
                           className="h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                           {isLoading ? (
                              <>
                                 <Loader2 className="w-4 h-4 animate-spin" />
                                 <span>Đang lưu thay đổi...</span>
                              </>
                           ) : (
                              <>
                                 <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M5 13l4 4L19 7"
                                    />
                                 </svg>
                                 <span>Lưu thay đổi</span>
                              </>
                           )}
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}
