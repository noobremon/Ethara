const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('ethara_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  signup: (name, email, password, avatar_url) =>
    fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, avatar_url })
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  getUsers: () =>
    fetch(`${API_BASE}/auth/users`, { headers: getHeaders() }).then(handleResponse),

  // Projects
  getProjects: () =>
    fetch(`${API_BASE}/projects`, { headers: getHeaders() }).then(handleResponse),

  getProject: (id) =>
    fetch(`${API_BASE}/projects/${id}`, { headers: getHeaders() }).then(handleResponse),

  createProject: (projectData) =>
    fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    }).then(handleResponse),

  updateProject: (id, projectData) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    }).then(handleResponse),

  deleteProject: (id) =>
    fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  addProjectMember: (projectId, userId, role) =>
    fetch(`${API_BASE}/projects/${projectId}/members`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ user_id: userId, role })
    }).then(handleResponse),

  updateMemberRole: (projectId, userId, role) =>
    fetch(`${API_BASE}/projects/${projectId}/members/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    }).then(handleResponse),

  removeMember: (projectId, userId) =>
    fetch(`${API_BASE}/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/tasks${query ? '?' + query : ''}`, { headers: getHeaders() }).then(handleResponse);
  },

  getTask: (id) =>
    fetch(`${API_BASE}/tasks/${id}`, { headers: getHeaders() }).then(handleResponse),

  createTask: (taskData) =>
    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    }).then(handleResponse),

  updateTask: (id, taskData) =>
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    }).then(handleResponse),

  updateTaskStatus: (id, status) =>
    fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    }).then(handleResponse),

  deleteTask: (id) =>
    fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Dashboard
  getDashboardStats: () =>
    fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() }).then(handleResponse)
};
