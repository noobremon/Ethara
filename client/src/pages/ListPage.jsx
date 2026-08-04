import React from 'react';
import { Calendar, AlertTriangle, Edit3, Trash2, CheckCircle2, User, Flag } from 'lucide-react';

export default function ListPage({ tasks, projects, onOpenTaskModal, onUpdateStatus, onDeleteTask, userRole }) {
  const getPriorityBadge = (p) => {
    switch (p) {
      case 'urgent': return <span className="badge badge-urgent">🚨 Urgent</span>;
      case 'high': return <span className="badge badge-high">High</span>;
      case 'medium': return <span className="badge badge-medium">Medium</span>;
      case 'low': return <span className="badge badge-low">Low</span>;
      default: return <span className="badge badge-low">{p}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white glow-text">Task Directory & Audit Table</h2>
          <p className="text-xs text-slate-400">Structured tabular view of all project deliverables, assignees & status controls</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {tasks.length} Total Records
        </span>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Deliverable Title</th>
                <th className="p-4">Project</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No matching tasks found in workspace.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

                  return (
                    <tr key={task.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-4">
                        <p
                          onClick={() => onOpenTaskModal(task)}
                          className="font-bold text-slate-100 hover:text-indigo-300 cursor-pointer text-sm"
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full text-slate-100"
                          style={{ backgroundColor: task.project_color || '#6366F1' }}
                        >
                          {task.project_name || 'Project'}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                          className="bg-slate-900 text-slate-200 border border-white/10 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-indigo-500"
                        >
                          <option value="todo">📋 To Do</option>
                          <option value="in_progress">⚡ In Progress</option>
                          <option value="in_review">🔍 In Review</option>
                          <option value="completed">✅ Completed</option>
                        </select>
                      </td>

                      <td className="p-4">
                        {getPriorityBadge(task.priority)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignee_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee_name || 'User'}`}
                            alt={task.assignee_name || 'Unassigned'}
                            className="h-6 w-6 rounded-full object-cover bg-slate-800 border border-white/10"
                          />
                          <span className="font-medium text-slate-300">
                            {task.assignee_name || 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {task.due_date ? (
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            isOverdue ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                            {task.due_date.split('T')[0]}
                          </span>
                        ) : (
                          <span className="text-slate-500">No deadline</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenTaskModal(task)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                            title="Edit task"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete task (Admin)"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
