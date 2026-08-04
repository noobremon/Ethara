import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  User,
  Kanban
} from 'lucide-react';

export default function BoardPage({ 
  tasks, 
  projects, 
  users, 
  onOpenTaskModal, 
  onUpdateStatus,
  searchQuery,
  setSearchQuery,
  selectedProjectId
}) {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [overdueOnly, setOverdueOnly] = useState(false);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-blue-500/40 bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-amber-500/40 bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-300' },
    { id: 'in_review', title: 'In Review', color: 'border-purple-500/40 bg-purple-500/5', badge: 'bg-purple-500/20 text-purple-300' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500/40 bg-emerald-500/5', badge: 'bg-emerald-500/20 text-emerald-300' },
  ];

  // Filter tasks logic
  const filteredTasks = tasks.filter((t) => {
    if (selectedProjectId && t.project_id !== selectedProjectId) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'all' && t.assignee_id !== Number(assigneeFilter)) return false;
    if (overdueOnly && (!t.due_date || new Date(t.due_date) >= new Date() || t.status === 'completed')) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description && t.description.toLowerCase().includes(q);
      const matchProject = t.project_name && t.project_name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchProject) return false;
    }
    return true;
  });

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'urgent': return 'badge-urgent';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-low';
    }
  };

  const getNextStatus = (current) => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'completed';
    return null;
  };

  const getPrevStatus = (current) => {
    if (current === 'completed') return 'in_review';
    if (current === 'in_review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Priority Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Priority:
          </span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                priorityFilter === p
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Assignee & Overdue Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOverdueOnly(!overdueOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              overdueOnly
                ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-lg shadow-red-500/20'
                : 'bg-slate-900 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            <span>Overdue Only</span>
          </button>
        </div>
      </div>

      {/* Kanban 4 Column Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`glass-panel p-4 rounded-2xl border ${col.color} flex flex-col h-[calc(100vh-230px)] min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onOpenTaskModal(null, col.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Task Cards Column Stack */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-slate-500 text-xs">
                    <span>No tasks in {col.title}</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isOverdue =
                      task.due_date &&
                      new Date(task.due_date) < new Date() &&
                      task.status !== 'completed';

                    const next = getNextStatus(task.status);
                    const prev = getPrevStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl bg-slate-900/90 border glass-card-interactive space-y-2.5 relative group ${
                          isOverdue ? 'border-red-500/40 shadow-sm shadow-red-500/20' : 'border-white/10'
                        }`}
                      >
                        {/* Project Color pill & Priority badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-200 truncate max-w-[130px]"
                            style={{ backgroundColor: task.project_color || '#6366F1' }}
                          >
                            {task.project_name || 'Project'}
                          </span>

                          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => onOpenTaskModal(task)}
                          className="text-sm font-bold text-slate-100 hover:text-indigo-300 cursor-pointer transition-all leading-snug"
                        >
                          {task.title}
                        </h4>

                        {/* Description Preview */}
                        {task.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Card Footer: Assignee Avatar + Due Date */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                          {/* Assignee */}
                          <div className="flex items-center gap-1.5">
                            <img
                              src={task.assignee_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee_name || 'User'}`}
                              alt={task.assignee_name || 'Unassigned'}
                              className="h-6 w-6 rounded-full object-cover bg-slate-800 border border-white/10"
                            />
                            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[80px]">
                              {task.assignee_name ? task.assignee_name.split(' ')[0] : 'Unassigned'}
                            </span>
                          </div>

                          {/* Due Date Indicator */}
                          {task.due_date && (
                            <div
                              className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                isOverdue
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'text-slate-400 bg-slate-800/80'
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              <span>{task.due_date.split('T')[0]}</span>
                            </div>
                          )}
                        </div>

                        {/* Quick Move Action Controls on Hover/Bottom */}
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          {prev ? (
                            <button
                              onClick={() => onUpdateStatus(task.id, prev)}
                              className="text-slate-400 hover:text-white flex items-center gap-0.5 p-1 rounded hover:bg-slate-800 transition-all"
                              title={`Move back to ${prev.replace('_', ' ')}`}
                            >
                              <ArrowLeft className="h-3 w-3" /> Prev
                            </button>
                          ) : <div />}

                          {next ? (
                            <button
                              onClick={() => onUpdateStatus(task.id, next)}
                              className="text-indigo-400 hover:text-indigo-200 font-bold flex items-center gap-0.5 p-1 rounded hover:bg-indigo-500/20 transition-all"
                              title={`Move forward to ${next.replace('_', ' ')}`}
                            >
                              Next <ArrowRight className="h-3 w-3" />
                            </button>
                          ) : <div />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
