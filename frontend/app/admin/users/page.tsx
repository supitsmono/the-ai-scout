"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, updateAdminUser, deleteAdminUser, resetUserTrial, extendUserTrial, getAdminUser } from "@/lib/api";
import { Search, Edit, Trash2, RotateCcw, Calendar, X, Save, CalendarPlus } from "lucide-react";

interface User {
  id: number;
  email: string;
  agency_name: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  role: string;
  email_verified: boolean;
  subscription_status: string;
  trial_ends_at: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(7);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers({ search, limit: 100 });
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      await updateAdminUser(userId, { is_active: !currentStatus });
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteAdminUser(userId);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleResetTrial = async (userId: number) => {
    if (!confirm("Reset trial for this user? This will start a new 7-day trial.")) return;
    try {
      await resetUserTrial(userId);
      loadUsers();
    } catch (error) {
      console.error("Error resetting trial:", error);
      alert("Failed to reset trial");
    }
  };

  const handleExtendTrial = async () => {
    if (!selectedUserId) return;
    try {
      await extendUserTrial(selectedUserId, extendDays);
      setShowExtendModal(false);
      setSelectedUserId(null);
      setExtendDays(7);
      loadUsers();
    } catch (error) {
      console.error("Error extending trial:", error);
      alert("Failed to extend trial");
    }
  };

  const handleEditUser = async (user: User) => {
    try {
      const fullUser = await getAdminUser(user.id);
      setEditingUser(fullUser);
    } catch (error) {
      console.error("Error loading user:", error);
      alert("Failed to load user details");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await updateAdminUser(editingUser.id, {
        is_active: editingUser.is_active,
        is_admin: editingUser.is_admin,
        role: editingUser.role,
        email_verified: editingUser.email_verified,
        subscription_status: editingUser.subscription_status,
      });
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-slate-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage all user accounts</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search users by email, name, or agency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-white/5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/2 border-b border-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/2">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{user.full_name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                      <div className="text-xs text-slate-500">{user.agency_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </div>
                      {user.is_admin && (
                        <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 ml-2">
                          Admin
                        </div>
                      )}
                      {!user.email_verified && (
                        <div className="block px-2 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-400 mt-1">
                          Unverified
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.subscription_status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                        user.subscription_status === "trial" ? "bg-blue-500/10 text-blue-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {user.subscription_status}
                      </div>
                      {user.trial_ends_at && (
                        <div className="text-xs text-slate-500 mt-1">
                          Trial ends: {new Date(user.trial_ends_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </button>
                      {user.subscription_status === "trial" && (
                        <>
                          <button
                            onClick={() => handleResetTrial(user.id)}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            title="Reset Trial"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowExtendModal(true);
                            }}
                            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                            title="Extend Trial"
                          >
                            <CalendarPlus className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit User</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name}
                  disabled
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Agency Name</label>
                <input
                  type="text"
                  value={editingUser.agency_name}
                  disabled
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingUser.is_active}
                  onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
                <label className="text-sm font-medium text-slate-300">Active</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingUser.is_admin}
                  onChange={(e) => setEditingUser({ ...editingUser, is_admin: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
                <label className="text-sm font-medium text-slate-300">Admin</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingUser.email_verified}
                  onChange={(e) => setEditingUser({ ...editingUser, email_verified: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
                <label className="text-sm font-medium text-slate-300">Email Verified</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subscription Status</label>
                <select
                  value={editingUser.subscription_status}
                  onChange={(e) => setEditingUser({ ...editingUser, subscription_status: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="agency">Agency</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Trial Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Extend Trial</h2>
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setSelectedUserId(null);
                  setExtendDays(7);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Extend by (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={extendDays}
                  onChange={(e) => setExtendDays(parseInt(e.target.value) || 7)}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setSelectedUserId(null);
                  setExtendDays(7);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendTrial}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Extend Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

