import React from 'react';
import { Plus, Users, Shield, Folder, Trash2, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectsPage({ 
  projects, 
  onOpenCreateProject, 
  onOpenTeamModal, 
  onDeleteProject,
  onOpenCreateTaskForProject,
  currentUserId
}) {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white glow-text">Projects & Team Workspaces</h2>
          <p className="text-xs text-slate-400">
            Create projects, invite team members, assign RBAC permissions (Admin / Member)
          </p>
        </div>

        <button
          onClick={onOpenCreateProject}
          className="btn-primary py-2.5 px-4 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => {
          const totalTasks = p.task_count || 0;
          const completedTasks = p.completed_task_count || 0;
          const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          const isAdmin = p.role === 'Admin' || p.owner_id === currentUserId;

          return (
            <div
              key={p.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 glass-card-interactive flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Top Accent Color Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: p.color || '#6366F1' }}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`badge ${isAdmin ? 'badge-role-admin' : 'badge-role-member'}`}>
                    <Shield className="h-3 w-3" />
                    {p.role || 'Member'}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete Project (Admin)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-white leading-snug">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-indigo-300">{completedTasks} / {totalTasks} Tasks ({progressPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: p.color || '#6366F1'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer: Member Avatar Stack & Manage Team Trigger */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                {/* Avatars */}
                <div className="flex items-center -space-x-2 overflow-hidden">
                  {p.members && p.members.slice(0, 4).map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                      alt={m.name}
                      className="inline-block h-7 w-7 rounded-full border-2 border-slate-900 object-cover bg-slate-800"
                      title={`${m.name} (${m.role})`}
                    />
                  ))}
                  {p.members && p.members.length > 4 && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-900 text-[10px] font-bold text-slate-300">
                      +{p.members.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenTeamModal(p)}
                    className="btn-secondary py-1.5 px-3 text-xs"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Team</span>
                  </button>

                  <button
                    onClick={() => onOpenCreateTaskForProject(p.id)}
                    className="btn-primary py-1.5 px-3 text-xs"
                    title="Add task to project"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
