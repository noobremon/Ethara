import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import TeamModal from './components/TeamModal';

import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import ListPage from './pages/ListPage';
import ProjectsPage from './pages/ProjectsPage';

import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ethara_token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // App Navigation & Filter State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data Store State
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Modal Control States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskModalDefaultStatus, setTaskModalDefaultStatus] = useState('todo');

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeamProject, setSelectedTeamProject] = useState(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Auth Check
  useEffect(() => {
    if (token) {
      api.getMe()
        .then((res) => {
          setUser(res.user);
          loadWorkspaceData();
        })
        .catch(() => {
          handleLogout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Load all workspace data
  const loadWorkspaceData = async () => {
    try {
      const [projRes, taskRes, userRes, dashRes] = await Promise.all([
        api.getProjects(),
        api.getTasks(),
        api.getUsers(),
        api.getDashboardStats()
      ]);

      setProjects(projRes.projects || []);
      setTasks(taskRes.tasks || []);
      setAllUsers(userRes.users || []);
      setDashboardStats(dashRes);
    } catch (err) {
      console.error('Failed to load workspace data:', err);
    }
  };

  // Auth Handlers
  const handleLogin = async (email, password) => {
    try {
      setAuthError(null);
      const res = await api.login(email, password);
      localStorage.setItem('ethara_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`);
      loadWorkspaceData();
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password');
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      setAuthError(null);
      const res = await api.signup(name, email, password);
      localStorage.setItem('ethara_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(`Account created! Welcome ${res.user.name}`);
      loadWorkspaceData();
    } catch (err) {
      setAuthError(err.message || 'Signup failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ethara_token');
    setToken(null);
    setUser(null);
  };

  const handleQuickSwitchUser = async (demoEmail) => {
    try {
      const res = await api.login(demoEmail, 'password123');
      localStorage.setItem('ethara_token', res.token);
      setToken(res.token);
      setUser(res.user);
      showToast(`Switched account to: ${res.user.name} (${res.user.email})`);
      loadWorkspaceData();
    } catch (err) {
      showToast('Quick switch failed', true);
    }
  };

  // Task Operations
  const handleSaveTask = async (taskData) => {
    try {
      if (taskData.id) {
        await api.updateTask(taskData.id, taskData);
        showToast('Task updated successfully!');
      } else {
        await api.createTask(taskData);
        showToast('New task created!');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      loadWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Task operation failed', true);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.updateTaskStatus(taskId, newStatus);
      showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
      loadWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to update status', true);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      showToast('Task deleted successfully');
      setIsTaskModalOpen(false);
      loadWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', true);
    }
  };

  // Project Operations
  const handleCreateProject = async (projectData) => {
    try {
      const res = await api.createProject(projectData);
      showToast(`Project "${res.project.name}" created!`);
      loadWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to create project', true);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete project? All associated tasks will be removed.')) return;
    try {
      await api.deleteProject(projectId);
      showToast('Project deleted successfully');
      loadWorkspaceData();
    } catch (err) {
      showToast(err.message || 'Failed to delete project', true);
    }
  };

  // Team Member & RBAC Operations
  const handleAddMember = async (projectId, userId, role) => {
    try {
      await api.addProjectMember(projectId, userId, role);
      showToast('Team member added!');
      loadWorkspaceData();
      // refresh team modal project object
      const updatedProj = await api.getProject(projectId);
      setSelectedTeamProject(updatedProj.project);
    } catch (err) {
      showToast(err.message || 'Failed to add member', true);
    }
  };

  const handleUpdateRole = async (projectId, userId, role) => {
    try {
      await api.updateMemberRole(projectId, userId, role);
      showToast(`Role updated to ${role}`);
      loadWorkspaceData();
      const updatedProj = await api.getProject(projectId);
      setSelectedTeamProject(updatedProj.project);
    } catch (err) {
      showToast(err.message || 'Failed to update role', true);
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    try {
      await api.removeMember(projectId, userId);
      showToast('Member removed from project');
      loadWorkspaceData();
      const updatedProj = await api.getProject(projectId);
      setSelectedTeamProject(updatedProj.project);
    } catch (err) {
      showToast(err.message || 'Failed to remove member', true);
    }
  };

  // Modal Launchers
  const openTaskModalForEdit = (task = null, defaultStatus = 'todo') => {
    setEditingTask(task);
    setTaskModalDefaultStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };

  const openTeamModalForProject = async (project) => {
    try {
      const res = await api.getProject(project.id);
      setSelectedTeamProject(res.project);
      setIsTeamModalOpen(true);
    } catch (err) {
      showToast('Failed to load project details', true);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-obsidian text-slate-200">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto" />
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-400">Loading Ethara Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-2xl text-xs font-bold animate-fade-in flex items-center gap-2 ${
          toastMessage.isError
            ? 'bg-red-950/90 text-red-300 border-red-500/40'
            : 'bg-indigo-950/90 text-indigo-300 border-indigo-500/40'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Auth Screen Modal if user not logged in */}
      {!user ? (
        <AuthModal
          onLogin={handleLogin}
          onSignup={handleSignup}
          error={authError}
          setError={setAuthError}
        />
      ) : (
        <>
          {/* Top Navbar Header */}
          <Navbar
            user={user}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onOpenCreateTask={() => openTaskModalForEdit(null)}
            onOpenCreateProject={() => setIsProjectModalOpen(true)}
            onLogout={handleLogout}
            onQuickSwitchUser={handleQuickSwitchUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Main Layout Area */}
          <div className="flex flex-1">
            {/* Sidebar Navigation */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              stats={dashboardStats}
            />

            {/* Page View Body */}
            <main className="flex-1 p-6 overflow-x-hidden">
              {activeTab === 'dashboard' && (
                <DashboardPage
                  stats={dashboardStats}
                  onOpenTask={openTaskModalForEdit}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  user={user}
                />
              )}

              {activeTab === 'board' && (
                <BoardPage
                  tasks={tasks}
                  projects={projects}
                  users={allUsers}
                  onOpenTaskModal={openTaskModalForEdit}
                  onUpdateStatus={handleUpdateTaskStatus}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedProjectId={selectedProjectId}
                />
              )}

              {activeTab === 'list' && (
                <ListPage
                  tasks={tasks}
                  projects={projects}
                  onOpenTaskModal={openTaskModalForEdit}
                  onUpdateStatus={handleUpdateTaskStatus}
                  onDeleteTask={handleDeleteTask}
                  userRole={user.role}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsPage
                  projects={projects}
                  onOpenCreateProject={() => setIsProjectModalOpen(true)}
                  onOpenTeamModal={openTeamModalForProject}
                  onDeleteProject={handleDeleteProject}
                  onOpenCreateTaskForProject={(pId) => {
                    setSelectedProjectId(pId);
                    openTaskModalForEdit(null);
                  }}
                  currentUserId={user.id}
                />
              )}
            </main>
          </div>

          {/* Modals */}
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            initialTask={editingTask}
            projects={projects}
            users={allUsers}
            currentUserId={user.id}
          />

          <ProjectModal
            isOpen={isProjectModalOpen}
            onClose={() => setIsProjectModalOpen(false)}
            onCreate={handleCreateProject}
          />

          <TeamModal
            isOpen={isTeamModalOpen}
            onClose={() => setIsTeamModalOpen(false)}
            project={selectedTeamProject}
            allUsers={allUsers}
            onAddMember={handleAddMember}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
            currentUserId={user.id}
          />
        </>
      )}
    </div>
  );
}
