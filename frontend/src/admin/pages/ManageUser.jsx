import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");

        // Remove duplicates by email
        const unique = res.data.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.email === user.email)
        );

        setUsers(unique);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  // Toggle block/unblock
  const toggleBlock = async (user) => {
    try {
      await api.patch(`/users/${user._id}`, {
        isBlocked: !user.isBlocked,
      });

      setUsers(
        users.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );

      toast.success(`User ${user.name || user.email} updated successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };
  const handleRoleChange = async (user, newRole) => {
    try {
      await api.patch(`/users/${user._id}`, {
        role: newRole,
      });

      setUsers(
        users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );

      toast.success("Role updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };
  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);

      // Show toast
      toast.success("User deleted successfully");

      // Update UI
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name || u.email}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role || "user"}
                    onChange={(e) => handleRoleChange(u, e.target.value)}
                    className="text-white-600 bg-black"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </td>

                <td className="font-semibold">{u.isBlocked ? "Yes" : "No"}</td>

                <td className="flex gap-4 text-xl py-2">
                  {/* Toggle Block / Unblock */}
                  <button
                    onClick={() => toggleBlock(u)}
                    className="text-blue-600 hover:text-blue-800"
                    title={u.isBlocked ? "Unblock User" : "Block User"}
                  >
                    {u.isBlocked ? <FaToggleOff /> : <FaToggleOn />}
                  </button>

                  {/* Delete User */}
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
