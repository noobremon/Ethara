import React, { useState } from 'react';
import { X, FolderPlus, Palette } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    onCreate({ name: name.trim(), description, color });
    setName('');
    setDescription('');
    setColor('#6366F1');
    onClose();
  };

  const presetColors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#EF4444'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl bg-slate-900/95 relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white glow-text">New Project Workspace</h3>
              <p className="text-xs text-slate-400">Initialize project repository & team</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/30">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ethara Mobile App Relaunch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Key objectives, scope and roadmap..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
              <Palette className="h-3.5 w-3.5 text-indigo-400" />
              <span>Theme Color</span>
            </label>
            <div className="flex items-center gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-4">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
