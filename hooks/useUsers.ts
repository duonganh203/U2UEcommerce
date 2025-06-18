import { useState, useEffect } from "react";

export interface User {
   id: string;
   name: string;
   email: string;
   role: "user" | "admin";
   status: "active" | "inactive";
   joined: string;
   orders: number;
   firstName?: string;
   lastName?: string;
   phoneNumber?: string;
   avatar?: string;
   address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
   };
}

export interface UsersFilters {
   search: string;
   role: string;
   status: string;
   page: number;
   limit: number;
}

export interface UsersResponse {
   users: User[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
   };
}

export const useUsers = () => {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [pagination, setPagination] = useState({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
   });

   const fetchUsers = async (filters: Partial<UsersFilters> = {}) => {
      setLoading(true);
      setError(null);

      try {
         const params = new URLSearchParams();
         if (filters.search) params.append("search", filters.search);
         if (filters.role && filters.role !== "all")
            params.append("role", filters.role);
         if (filters.status && filters.status !== "all")
            params.append("status", filters.status);
         if (filters.page) params.append("page", filters.page.toString());
         if (filters.limit) params.append("limit", filters.limit.toString());

         const response = await fetch(`/api/admin/users?${params.toString()}`);

         if (!response.ok) {
            throw new Error("Failed to fetch users");
         }

         const data: UsersResponse = await response.json();
         setUsers(data.users);
         setPagination(data.pagination);
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
         setLoading(false);
      }
   };

   const createUser = async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: string;
      phoneNumber?: string;
   }) => {
      setLoading(true);
      setError(null);

      try {
         const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create user");
         }

         const data = await response.json();
         setUsers((prev) => [data.user, ...prev]);
         return data.user;
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
         throw err;
      } finally {
         setLoading(false);
      }
   };

   const updateUser = async (
      userId: string,
      userData: {
         email?: string;
         firstName?: string;
         lastName?: string;
         role?: string;
         phoneNumber?: string;
         status?: string;
      }
   ) => {
      setLoading(true);
      setError(null);

      try {
         const response = await fetch(`/api/admin/users/${userId}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update user");
         }

         const data = await response.json();
         setUsers((prev) =>
            prev.map((user) => (user.id === userId ? data.user : user))
         );
         return data.user;
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
         throw err;
      } finally {
         setLoading(false);
      }
   };

   const deleteUser = async (userId: string) => {
      setLoading(true);
      setError(null);

      try {
         const response = await fetch(`/api/admin/users/${userId}`, {
            method: "DELETE",
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete user");
         }

         setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
         throw err;
      } finally {
         setLoading(false);
      }
   };

   const changeUserStatus = async (
      userId: string,
      status: "active" | "inactive"
   ) => {
      return updateUser(userId, { status });
   };

   return {
      users,
      loading,
      error,
      pagination,
      fetchUsers,
      createUser,
      updateUser,
      deleteUser,
      changeUserStatus,
   };
};
