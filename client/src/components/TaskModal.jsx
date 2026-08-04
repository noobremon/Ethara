import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, User, Folder, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  initialTask, 
  projects, 
  users, 
  currentUserId 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setProjectId(initialTask.project_id || (projects[0]?.id || ''));
      setAssigneeId(initialTask.assignee_id || '');
      setStatus(initialTask.status || 'todo');
      setPriority(initialTask.priority || 'medium');
      setDueDate(initialTask.due_date ? initialTask.due_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || '');
      setAssigneeId('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    }
    setError('');
  }, [initialTask, projects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!projectId) {
      setError('Please select a project');
      return;
    }

    onSave({
      id: initialTask?.id,
      title: title.trim(),
      description,
      project_id: Number(projectId),
      assignee_id: assigneeId ? Number(assigneeId) : null,
      status,
      priority,
      due_date: dueDate || null
    });
  };

  // Find project role for current user
  const selectedProjectObj = projects.find(p => p.id === Number(projectId));
  const userProjectRole = selectedProjectObj?.role || 'Member';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl bg-slate-900/95 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white glow-text">
              {initialTask ? 'Edit Task Deliverable' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-400">
              Set task details, assign responsibility & target milestones
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth2 Refresh Token Flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Acceptance Criteria</label>
            <textarea
              rows={3}
              placeholder="Add technical context, API specifications or testing requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Project & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5 text-indigo-400" />
                <span>Target Project *</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-purple-400" />
                <span>Assignee</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status, Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="todo">📋 To Do</option>
                <option value="in_progress">⚡ In Progress</option>
                <option value="in_review">🔍 In Review</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Flag className="h-3.5 w-3.5 text-amber-400" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            {initialTask && (
              <button
                type="button"
                onClick={() => onDelete(initialTask.id)}
                disabled={userProjectRole !== 'Admin'}
                title={userProjectRole !== 'Admin' ? 'Only Project Admin can delete tasks' : ''}
                className={`btn-danger text-xs ${userProjectRole !== 'Admin' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Delete Task
              </button>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-4"
              >
                {initialTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
