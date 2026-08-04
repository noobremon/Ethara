import React from 'react';
import { LayoutGrid, Plus, Search, ShieldCheck, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar({ 
  user, 
  projects, 
  selectedProjectId, 
  onSelectProject, 
  onOpenCreateTask, 
  onOpenCreateProject, 
  onLogout,
  onQuickSwitchUser,
  searchQuery,
  setSearchQuery
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Branding & Project Picker */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight glow-text leading-tight">
                ETHARA <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">v2.0</span>
              </h1>
              <p className="text-xs text-slate-400">Team Taskflow Engine</p>
            </div>
          </div>

          {/* Project Dropdown Selector */}
          <div className="relative hidden md:block">
            <select
              value={selectedProjectId || ''}
              onChange={(e) => onSelectProject(e.target.value ? Number(e.target.value) : null)}
              className="appearance-none bg-slate-900/90 text-slate-200 border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-inner"
            >
              <option value="">All Projects Overview</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role || 'Member'})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Center Live Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, or priority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/70 text-slate-200 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right Actions & Account Control */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Switcher Pills */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-white/10 rounded-xl p-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">Switch Role:</span>
            <button
              id="switch-admin-btn"
              onClick={() => onQuickSwitchUser('admin@ethara.com')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                user?.email === 'admin@ethara.com' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              👑 Admin
            </button>
            <button
              id="switch-member-btn"
              onClick={() => onQuickSwitchUser('member@ethara.com')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                user?.email === 'member@ethara.com' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              👤 Member
            </button>
          </div>

          {/* New Task Button */}
          <button
            id="btn-new-task"
            onClick={onOpenCreateTask}
            className="btn-primary py-2 px-3.5 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>

          {/* User Profile Avatar */}
          {user && (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="h-9 w-9 rounded-xl border border-indigo-500/40 object-cover bg-slate-800"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px] mt-0.5">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
