import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

export default function AuthModal({ onLogin, onSignup, error, setError }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@ethara.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      onLogin(email, password);
    } else {
      if (!name) {
        setError('Please enter your full name');
        return;
      }
      onSignup(name, email, password);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    onLogin(demoEmail, 'password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden bg-slate-900/90">
        
        {/* Glow ambient background sphere */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-1">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight glow-text">
            {isLogin ? 'Welcome Back to Ethara' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Sign in to access your projects and task board' : 'Join project teams and track deliverables effortlessly'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@ethara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary justify-center py-3 text-sm rounded-xl mt-2 font-bold"
          >
            <span>{isLogin ? 'Sign In to Workspace' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        {isLogin && (
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              🚀 Instant Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-login-admin"
                onClick={() => handleQuickLogin('admin@ethara.com')}
                className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="block text-[10px] text-slate-400 font-normal">Role: Admin</span>
                  <span>Alex Mercer</span>
                </div>
                <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
              </button>

              <button
                type="button"
                id="btn-login-member"
                onClick={() => handleQuickLogin('member@ethara.com')}
                className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="block text-[10px] text-slate-400 font-normal">Role: Member</span>
                  <span>Marcus Vance</span>
                </div>
                <CheckCircle className="h-3.5 w-3.5 text-purple-400" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account?" : 'Already registered?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="ml-1.5 font-bold text-indigo-400 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
