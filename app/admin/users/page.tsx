"use client";

import React, { useState } from "react";

const UsersPage = () => {
   // Mock data for demonstration
   const initialUsers = [
      {
         id: "1",
         name: "John Smith",
         email: "john@example.com",
         role: "user",
         status: "active",
         joined: "June 1, 2025",
         orders: 12,
      },
      {
         id: "2",
         name: "Sarah Johnson",
         email: "sarah@example.com",
         role: "user",
         status: "active",
         joined: "May 28, 2025",
         orders: 5,
      },
      {
         id: "3",
         name: "Michael Brown",
         email: "michael@example.com",
         role: "user",
         status: "inactive",
         joined: "May 25, 2025",
         orders: 0,
      },
      {
         id: "4",
         name: "Emily Davis",
         email: "emily@example.com",
         role: "user",
         status: "active",
         joined: "May 22, 2025",
         orders: 8,
      },
      {
         id: "5",
         name: "Robert Wilson",
         email: "robert@example.com",
         role: "admin",
         status: "active",
         joined: "April 15, 2025",
         orders: 3,
      },
      {
         id: "6",
         name: "Jennifer Lee",
         email: "jennifer@example.com",
         role: "user",
         status: "active",
         joined: "May 18, 2025",
         orders: 2,
      },
      {
         id: "7",
         name: "David Miller",
         email: "david@example.com",
         role: "user",
         status: "active",
         joined: "May 10, 2025",
         orders: 7,
      },
      {
         id: "8",
         name: "Lisa Garcia",
         email: "lisa@example.com",
         role: "user",
         status: "inactive",
         joined: "April 29, 2025",
         orders: 1,
      },
   ];

   const [users, setUsers] = useState(initialUsers);
   const [searchTerm, setSearchTerm] = useState("");
   const [roleFilter, setRoleFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   // Filter users based on search term and filters
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

   const handleSaveUser = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would save to backend
      // For the UI demo, we'll just update the local state
      setUsers(
         users.map((user) =>
            user.id === selectedUser.id ? selectedUser : user
         )
      );
      setIsModalOpen(false);
   };

   const handleChangeStatus = (userId: string, newStatus: string) => {
      setUsers(
         users.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
         )
      );
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
                     role: "user",
                     status: "active",
                     joined: new Date().toLocaleDateString(),
                     orders: 0,
                  });
                  setIsModalOpen(true);
               }}
            >
               Add New User
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
                     Search Users
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
                     Filter by Role
                  </label>
                  <select
                     id="role"
                     value={roleFilter}
                     onChange={(e) => setRoleFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">All Roles</option>
                     <option value="user">Users</option>
                     <option value="admin">Admins</option>
                  </select>
               </div>
               <div>
                  <label
                     htmlFor="status"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Filter by Status
                  </label>
                  <select
                     id="status"
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">All Statuses</option>
                     <option value="active">Active</option>
                     <option value="inactive">Inactive</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Users Table */}
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Orders
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Actions
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
                                 Edit
                              </button>
                              {user.status === "active" ? (
                                 <button
                                    onClick={() =>
                                       handleChangeStatus(user.id, "inactive")
                                    }
                                    className="text-red-600 hover:text-red-900"
                                 >
                                    Deactivate
                                 </button>
                              ) : (
                                 <button
                                    onClick={() =>
                                       handleChangeStatus(user.id, "active")
                                    }
                                    className="text-green-600 hover:text-green-900"
                                 >
                                    Activate
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
                  No users found matching your filters.
               </div>
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
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Name
                           </label>
                           <input
                              type="text"
                              id="name"
                              value={selectedUser.name}
                              onChange={(e) =>
                                 setSelectedUser({
                                    ...selectedUser,
                                    name: e.target.value,
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
                        <div>
                           <label
                              htmlFor="role"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Role
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
                              Status
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
                           Cancel
                        </button>
                        <button
                           type="submit"
                           className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                        >
                           Save
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
