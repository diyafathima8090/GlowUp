import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaTrash, FaToggleOn, FaToggleOff, FaUserShield, FaUserFriends, FaUserSlash, FaSearch, FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async (searchQuery = "") => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: { search: searchQuery }
      });
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(search);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  // Toggle block/unblock
  const toggleBlock = async (user) => {
    try {
      await api.patch(`/admin/users/${user._id}`, {
        isBlocked: !user.isBlocked,
      });

      setUsers(
        users.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );

      toast.success(`User ${user.name || user.email} ${!user.isBlocked ? "blocked" : "unblocked"}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await api.patch(`/admin/users/${user._id}`, {
        role: newRole,
      });

      setUsers(
        users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );

      toast.success(`${user.name || "User"}'s role updated to ${newRole}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User removed from database");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const restrictedUsers = users.filter(u => u.isBlocked).length;

  return (
    <div className="p-0 md:p-6 w-full max-w-full overflow-hidden animate-in fade-in duration-500">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 tracking-tight mb-2">
            Identity Management
          </h1>
          <p className="text-gray-400 text-sm font-medium italic">Control access and roles for all registered members</p>
        </div>

        {/* QUICK STATS */}
        <div className="flex gap-4">
          <div className="bg-[#1b0a24]/80 border border-pink-500/10 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <FaUserFriends />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total</p>
              <p className="text-lg font-bold text-white">{totalUsers}</p>
            </div>
          </div>

          <div className="bg-[#1b0a24]/80 border border-green-500/10 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <FaUserShield />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active</p>
              <p className="text-lg font-bold text-white">{activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="relative group mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-pink-400 group-focus-within:text-pink-300 transition-colors">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search identity by name or email..."
          className="w-full bg-[#1b0a24]/50 border border-white/5 group-hover:border-pink-500/30 group-focus-within:border-pink-500/50 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all placeholder-gray-600 shadow-xl backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#1b0a24]/20 rounded-3xl border border-white/5 backdrop-blur-sm">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-pink-400/60 mt-6 font-bold uppercase tracking-[0.3em] text-xs">Decrypting Records...</p>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 bg-[#1b0a24]/40 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-300">
                  <th className="px-8 py-6 font-bold uppercase text-[10px] tracking-[0.2em]">Member Profile</th>
                  <th className="px-8 py-6 font-bold uppercase text-[10px] tracking-[0.2em]">Secure Ident</th>
                  <th className="px-8 py-6 font-bold uppercase text-[10px] tracking-[0.2em]">Privileges</th>
                  <th className="px-8 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-center">Orders</th>
                  <th className="px-8 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-center">Security Status</th>
                  <th className="px-8 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-center">Direct Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {users.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-white/[0.03] transition-all duration-300 group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${u.isBlocked ? 'from-gray-700 to-gray-900' : 'from-pink-500 to-purple-600'} flex items-center justify-center text-white font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-white/20`}>
                            {(u.name?.[0] || u.email?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1b0a24] ${u.isBlocked ? 'bg-red-500' : 'bg-green-400'}`}></div>
                        </div>
                        <div>
                          <span className="block font-bold text-gray-100 group-hover:text-pink-400 transition-colors uppercase tracking-tight">{u.name || "Ghost Member"}</span>
                          <span className="text-[10px] text-gray-500 font-mono">UID: {u._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="text-gray-400 font-medium text-sm group-hover:text-gray-300 transition-colors">{u.email}</div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="relative">
                        <select
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="bg-black/50 text-pink-400 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer text-[10px] font-black uppercase tracking-widest appearance-none hover:bg-black/80"
                        >
                          <option value="admin">Administrator</option>
                          <option value="user">Verified User</option>
                          <option value="manager">Lead Manager</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-pink-500/50">▼</div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center justify-center">
                        <button
                          onClick={() => navigate("/admin/orders", { state: { search: u.name || u.email } })}
                          className="group/order flex items-center gap-2 bg-pink-500/10 hover:bg-pink-500/20 px-4 py-2 rounded-xl transition-all border border-pink-500/10 hover:border-pink-500/30"
                        >
                          <FaShoppingBag className="text-pink-400 group-hover/order:scale-110 transition-transform" />
                          <span className="text-white font-black text-sm">{u.orderCount || 0}</span>
                        </button>
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Total Orders</span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${u.isBlocked ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {u.isBlocked ? "Restricted" : "Authorized"}
                        </div>
                        <span className="text-[10px] text-gray-600 font-medium italic">{u.isBlocked ? "No login access" : "Active session enabled"}</span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => toggleBlock(u)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group/btn ${u.isBlocked ? "bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white" : "bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white"}`}
                          title={u.isBlocked ? "Grant Access" : "Revoke Access"}
                        >
                          <span className="text-xl group-hover/btn:scale-125 transition-transform">
                            {u.isBlocked ? <FaToggleOff /> : <FaToggleOn />}
                          </span>
                        </button>

                        <button
                          onClick={() => deleteUser(u._id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 group/del"
                          title="Purge Identity"
                        >
                          <span className="text-lg group-hover/del:scale-110 group-hover/del:rotate-12 transition-transform">
                            <FaTrash />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-32 text-center text-gray-500 flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl grayscale opacity-30 animate-pulse">
                <FaUserSlash />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-400 tracking-tight italic">No identities found within the encrypted records</p>
                <p className="text-xs text-gray-600 mt-2 font-mono uppercase tracking-widest">System signal: Zero matches detected</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="mt-8 flex justify-between items-center px-4">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">Identity System v1.4.2</p>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
