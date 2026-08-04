import React, { useState } from 'react';
import { X, Users, Shield, UserPlus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TeamModal({ 
  isOpen, 
  onClose, 
  project, 
  allUsers, 
  onAddMember, 
  onUpdateRole, 
  onRemoveMember,
  currentUserId 
}) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('Member');
  const [error, setError] = useState('');

  if (!isOpen || !project) return null;

  const isAdmin = project.user_role === 'Admin' || project.owner_id === currentUserId;
  const currentMembers = project.members || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }
    setError('');
    onAddMember(project.id, Number(selectedUserId), selectedRole);
    setSelectedUserId('');
  };

  // Filter users not already in project
  const availableUsers = allUsers.filter(
    (u) => !currentMembers.some((m) => m.id === u.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl bg-slate-900/95 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white glow-text">Team & Role Access</h3>
              <p className="text-xs text-slate-400">
                Manage members and permissions for <span className="text-indigo-400 font-semibold">{project.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* RBAC Status Banner */}
        <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between ${
          isAdmin 
            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>Your Project Role: <strong className="uppercase">{isAdmin ? 'Admin' : 'Member'}</strong></span>
          </div>
          {!isAdmin && <span className="text-[10px] text-amber-400 font-medium">Read-Only Access</span>}
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/30">{error}</p>
        )}

        {/* Add Member Section (Admin Only) */}
        {isAdmin && (
          <form onSubmit={handleAdd} className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-3">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-indigo-400" />
              <span>Add Team Member</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="sm:col-span-2 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Select Registered User --</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedUserId}
              className="w-full btn-primary py-2 text-xs justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Project Team
            </button>
          </form>
        )}

        {/* Current Members List */}
        <div className="mt-5 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Current Project Members ({currentMembers.length})
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {currentMembers.map((member) => {
              const isProjectOwner = project.owner_id === member.id;
              const isSelf = currentUserId === member.id;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                      alt={member.name}
                      className="h-9 w-9 rounded-xl object-cover bg-slate-800 border border-white/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {isSelf && <span className="text-[10px] text-indigo-400 font-medium">(You)</span>}
                        {isProjectOwner && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                            OWNER
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role Selector or Badge */}
                    {isAdmin && !isProjectOwner ? (
                      <select
                        value={member.role}
                        onChange={(e) => onUpdateRole(project.id, member.id, e.target.value)}
                        className="bg-slate-900 text-slate-200 border border-white/10 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                      </select>
                    ) : (
                      <span className={`badge ${member.role === 'Admin' ? 'badge-role-admin' : 'badge-role-member'}`}>
                        {member.role}
                      </span>
                    )}

                    {/* Remove Member Button */}
                    {isAdmin && !isProjectOwner && (
                      <button
                        onClick={() => onRemoveMember(project.id, member.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-right">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
