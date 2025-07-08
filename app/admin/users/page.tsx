"use client";

import React, { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";

const UsersPage = () => {
   const {
      users,
      loading,
      error,
      pagination,
      fetchUsers,
      createUser,
      updateUser,
      changeUserStatus,
   } = useUsers();

   const [searchTerm, setSearchTerm] = useState("");
   const [roleFilter, setRoleFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   // Fetch users on component mount and when filters change
   useEffect(() => {
      fetchUsers({
         search: searchTerm,
         role: roleFilter,
         status: statusFilter,
         page: 1,
         limit: 50, // Get more users for better demo
      });
   }, [searchTerm, roleFilter, statusFilter]);

   // Filter users locally for immediate feedback (the API also filters)
   const filteredUsers = users.filter((user) => {
      const matchesSearch =
         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
         statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
   });

   const handleEditUser = (user: any) => {
      setSelectedUser(user);
      setIsModalOpen(true);
   };

   const handleSaveUser = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         if (selectedUser.id) {
            // Update existing user
            await updateUser(selectedUser.id, {
               email: selectedUser.email,
               firstName:
                  selectedUser.firstName || selectedUser.name.split(" ")[0],
               lastName:
                  selectedUser.lastName ||
                  selectedUser.name.split(" ").slice(1).join(" "),
               role: selectedUser.role,
               phoneNumber: selectedUser.phoneNumber,
               status: selectedUser.status,
            });
         } else {
            // Create new user
            await createUser({
               email: selectedUser.email,
               password: selectedUser.password || "defaultPassword123!",
               firstName:
                  selectedUser.firstName || selectedUser.name.split(" ")[0],
               lastName:
                  selectedUser.lastName ||
                  selectedUser.name.split(" ").slice(1).join(" "),
               role: selectedUser.role,
               phoneNumber: selectedUser.phoneNumber,
            });
         }
         setIsModalOpen(false);
         setSelectedUser(null);
      } catch (error) {
         console.error("Error saving user:", error);
         // You might want to show a toast notification here
      }
   };

   const handleChangeStatus = async (userId: string, newStatus: string) => {
      try {
         await changeUserStatus(userId, newStatus as "active" | "inactive");
      } catch (error) {
         console.error("Error changing user status:", error);
         // You might want to show a toast notification here
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
               User Management
            </h1>
            <button
               className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
               onClick={() => {
                  setSelectedUser({
                     id: "",
                     name: "",
                     email: "",
                     firstName: "",
                     lastName: "",
                     role: "user",
                     status: "active",
                     joined: new Date().toLocaleDateString(),
                     orders: 0,
                     password: "",
                  });
                  setIsModalOpen(true);
               }}
            >
               Thêm người dùng mới
            </button>
         </div>

         {/* Filters and Search */}
         <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label
                     htmlFor="search"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Tìm kiếm người dùng
                  </label>
                  <input
                     type="text"
                     id="search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search by name or email..."
                     className="w-full border border-gray-300 rounded-md p-2"
                  />
               </div>
               <div>
                  <label
                     htmlFor="role"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Lọc theo vai trò
                  </label>
                  <select
                     id="role"
                     value={roleFilter}
                     onChange={(e) => setRoleFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">Tất cả vai trò</option>
                     <option value="user">Users</option>
                     <option value="admin">Admins</option>
                  </select>
               </div>
               <div>
                  <label
                     htmlFor="status"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Lọc theo trạng thái
                  </label>
                  <select
                     id="status"
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">Tất cả trạng thái</option>
                     <option value="active">Active</option>
                     <option value="inactive">Inactive</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Users Table */}
         <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading && (
               <div className="py-6 text-center text-gray-500">
                  Loading users...
               </div>
            )}
            {error && (
               <div className="py-6 text-center text-red-500">
                  Error: {error}
               </div>
            )}
            {!loading && !error && (
               <>
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Người dùng
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Vai trò
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Trạng thái
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Ngày tạo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Đơn hàng
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Hành động
                              </th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                       <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-500 font-medium">
                                             {user.name.charAt(0)}
                                          </span>
                                       </div>
                                       <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                             {user.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                             {user.email}
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          user.role === "admin"
                                             ? "bg-purple-100 text-purple-800"
                                             : "bg-blue-100 text-blue-800"
                                       }`}
                                    >
                                       {user.role}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                       className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          user.status === "active"
                                             ? "bg-green-100 text-green-800"
                                             : "bg-red-100 text-red-800"
                                       }`}
                                    >
                                       {user.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.joined}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.orders}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                       onClick={() => handleEditUser(user)}
                                       className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                       Sửa
                                    </button>
                                    {user.status === "active" ? (
                                       <button
                                          onClick={() =>
                                             handleChangeStatus(
                                                user.id,
                                                "inactive"
                                             )
                                          }
                                          className="text-red-600 hover:text-red-900"
                                       >
                                          Vô hiệu hóa
                                       </button>
                                    ) : (
                                       <button
                                          onClick={() =>
                                             handleChangeStatus(
                                                user.id,
                                                "active"
                                             )
                                          }
                                          className="text-green-600 hover:text-green-900"
                                       >
                                          Kích hoạt
                                       </button>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  {filteredUsers.length === 0 && (
                     <div className="py-6 text-center text-gray-500">
                        Không tìm thấy người dùng nào phù hợp với bộ lọc của bạn.
                     </div>
                  )}
               </>
            )}
         </div>

         {/* Edit User Modal */}
         {isModalOpen && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">
                        {selectedUser.id ? "Edit User" : "Add New User"}
                     </h3>
                     <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                     >
                        <span className="text-xl">×</span>
                     </button>
                  </div>
                  <form onSubmit={handleSaveUser}>
                     <div className="space-y-4">
                        <div>
                           <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Tên
                           </label>
                           <input
                              type="text"
                              id="firstName"
                              value={
                                 selectedUser.firstName ||
                                 selectedUser.name?.split(" ")[0] ||
                                 ""
                              }
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    firstName: e.target.value,
                                    name: `${e.target.value} ${
                                       selectedUser.lastName ||
                                       selectedUser.name
                                          ?.split(" ")
                                          .slice(1)
                                          .join(" ") ||
                                       ""
                                    }`.trim(),
                                 })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              required
                           />
                        </div>
                        <div>
                           <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Họ
                           </label>
                           <input
                              type="text"
                              id="lastName"
                              value={
                                 selectedUser.lastName ||
                                 selectedUser.name
                                    ?.split(" ")
                                    .slice(1)
                                    .join(" ") ||
                                 ""
                              }
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    lastName: e.target.value,
                                    name: `${
                                       selectedUser.firstName ||
                                       selectedUser.name?.split(" ")[0] ||
                                       ""
                                    } ${e.target.value}`.trim(),
                                 })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              required
                           />
                        </div>
                        <div>
                           <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Email
                           </label>
                           <input
                              type="email"
                              id="email"
                              value={selectedUser.email}
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    email: e.target.value,
                                 })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                              required
                           />
                        </div>
                        {!selectedUser.id && (
                           <div>
                              <label
                                 htmlFor="password"
                                 className="block text-sm font-medium text-gray-700"
                              >
                                 Mật khẩu
                              </label>
                              <input
                                 type="password"
                                 id="password"
                                 value={selectedUser.password || ""}
                                 onChange={(e) =>
                                    setSelectedUser({
                                       ...selectedUser,
                                       password: e.target.value,
                                    })
                                 }
                                 className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                 required={!selectedUser.id}
                                 minLength={8}
                                 placeholder="Minimum 8 characters"
                              />
                           </div>
                        )}
                        <div>
                           <label
                              htmlFor="phoneNumber"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Số điện thoại
                           </label>
                           <input
                              type="tel"
                              id="phoneNumber"
                              value={selectedUser.phoneNumber || ""}
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    phoneNumber: e.target.value,
                                 })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                           />
                        </div>
                        <div>
                           <label
                              htmlFor="role"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Vai trò
                           </label>
                           <select
                              id="role"
                              value={selectedUser.role}
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    role: e.target.value,
                                 })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                           >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                           </select>
                        </div>
                        <div>
                           <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Trạng thái
                           </label>
                           <select
                              id="status"
                              value={selectedUser.status}
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    status: e.target.value,
                                 })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                           >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                           </select>
                        </div>
                     </div>
                     <div className="mt-6 flex justify-end space-x-3">
                        <button
                           type="button"
                           onClick={() => setIsModalOpen(false)}
                           className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                           Hủy
                        </button>
                        <button
                           type="submit"
                           className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                        >
                           Lưu
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default UsersPage;
