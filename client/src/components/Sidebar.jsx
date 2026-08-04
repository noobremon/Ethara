import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  ListTodo, 
  FolderKanban, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Shield,
  Layers
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  projects, 
  selectedProjectId, 
  onSelectProject,
  stats
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'board', label: 'Kanban Board', icon: Kanban },
    { id: 'list', label: 'Task Directory', icon: ListTodo },
    { id: 'projects', label: 'Projects & Teams', icon: FolderKanban },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl flex flex-col justify-between p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        
        {/* Nav Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Project Filter Links */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between px-3 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Workspace</p>
            <Layers className="h-3.5 w-3.5 text-slate-500" />
          </div>

          <button
            onClick={() => onSelectProject(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
              selectedProjectId === null
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="truncate">All Projects</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {stats?.totalTasks || 0}
            </span>
          </button>

          {projects.map((p) => {
            const isSelected = selectedProjectId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: p.color || '#6366F1' }}
                  />
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {p.role || 'Member'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Dashboard Stat Snapshot Widget */}
      {stats && (
        <div className="mt-6 glass-panel p-3.5 rounded-xl border border-white/10 space-y-2.5 bg-slate-900/40">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span>Health Tracker</span>
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Completed</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {stats.completedTasks}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 block">Overdue</span>
              <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {stats.overdueTasksCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
