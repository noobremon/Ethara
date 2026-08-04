import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  Activity, 
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  UserCheck
} from 'lucide-react';

export default function DashboardPage({ stats, onOpenTask, onUpdateTaskStatus, user }) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3" />
        <span>Aggregating workspace analytics...</span>
      </div>
    );
  }

  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasksCount,
    completionRate,
    statusBreakdown,
    priorityBreakdown,
    overdueTasksList,
    recentActivities
  } = stats;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Workspace Dashboard
            </span>
            <span className="text-xs text-slate-400">Live Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white glow-text">
            Welcome back, {user?.name || 'Developer'}! 👋
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Here is your team's current velocity, deliverable status breakdown, and overdue task alerts.
          </p>
        </div>

        {/* Completion Ring Widget */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-white/10 z-10">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-1000"
                strokeDasharray={`${completionRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">{completionRate}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <p className="text-sm font-semibold text-slate-200">{completedTasks} of {totalTasks} Completed</p>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tasks */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{totalTasks}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-blue-400" /> Across active projects
          </p>
        </div>

        {/* In Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{inProgressTasks}</p>
          <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> Active dev sprint
          </p>
        </div>

        {/* Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{completedTasks}</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified & shipped
          </p>
        </div>

        {/* Overdue Alert Card */}
        <div className={`glass-panel p-5 rounded-2xl border glass-card-interactive ${
          overdueTasksCount > 0 
            ? 'border-red-500/40 bg-red-950/20 shadow-lg shadow-red-950/50' 
            : 'border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Overdue Tasks</span>
            <div className={`p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 ${overdueTasksCount > 0 ? 'pulse-red' : ''}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-400 mt-3">{overdueTasksCount}</p>
          <p className="text-xs text-red-300/80 mt-1">Requires immediate attention</p>
        </div>
      </div>

      {/* Middle Section: Overdue Attention Banner & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overdue Items Focus List (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-base font-bold text-white">Overdue Deliverables</h3>
            </div>
            <span className="text-xs text-slate-400">{overdueTasksList.length} items flagged</span>
          </div>

          {overdueTasksList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-200">No Overdue Tasks!</p>
              <p className="text-xs">All deliverables are on schedule or completed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasksList.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-red-500/30 hover:border-red-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-urgent">{task.priority}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-200"
                        style={{ backgroundColor: task.project_color || '#6366F1' }}
                      >
                        {task.project_name}
                      </span>
                    </div>
                    <h4
                      onClick={() => onOpenTask(task)}
                      className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer transition-all"
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-red-400 font-medium">
                      Due: {task.due_date ? task.due_date.split('T')[0] : 'Past due'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                      className="btn-secondary py-1.5 px-3 text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => onOpenTask(task)}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Status & Priority Visual Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Task Status Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>📋 To Do ({statusBreakdown.todo})</span>
                <span>{totalTasks ? Math.round((statusBreakdown.todo / totalTasks) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks ? (statusBreakdown.todo / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-amber-300 mb-1">
                <span>⚡ In Progress ({statusBreakdown.in_progress})</span>
                <span>{totalTasks ? Math.round((statusBreakdown.in_progress / totalTasks) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks ? (statusBreakdown.in_progress / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-purple-300 mb-1">
                <span>🔍 In Review ({statusBreakdown.in_review})</span>
                <span>{totalTasks ? Math.round((statusBreakdown.in_review / totalTasks) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks ? (statusBreakdown.in_review / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-emerald-300 mb-1">
                <span>✅ Completed ({statusBreakdown.completed})</span>
                <span>{totalTasks ? Math.round((statusBreakdown.completed / totalTasks) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks ? (statusBreakdown.completed / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Priority Matrix</h4>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <span className="block font-extrabold text-sm">{priorityBreakdown.urgent}</span>
                <span className="text-[10px]">Urgent</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <span className="block font-extrabold text-sm">{priorityBreakdown.high}</span>
                <span className="text-[10px]">High</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <span className="block font-extrabold text-sm">{priorityBreakdown.medium}</span>
                <span className="text-[10px]">Medium</span>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <span className="block font-extrabold text-sm">{priorityBreakdown.low}</span>
                <span className="text-[10px]">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Activity Timeline Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Recent Team Activity</h3>
          </div>
          <span className="text-xs text-slate-400">Audit & updates log</span>
        </div>

        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No recent activity logged yet.</p>
          ) : (
            recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs"
              >
                <img
                  src={act.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${act.user_name}`}
                  alt={act.user_name}
                  className="h-8 w-8 rounded-lg object-cover bg-slate-800 border border-white/10"
                />
                <div className="flex-1">
                  <p className="text-slate-200">
                    <strong className="text-indigo-300 font-bold">{act.user_name}</strong>{' '}
                    <span className="text-slate-300">{act.details}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(act.created_at).toLocaleString()} • {act.project_name || 'Project'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
