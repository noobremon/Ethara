import { Router } from 'express';
import db from '../db/index.js';
import { authenticateToken, requireProjectRole } from '../middleware/auth.js';

const router = Router();

// GET all projects for current user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const projects = db.prepare(`
    SELECT DISTINCT p.*, 
      (SELECT role FROM project_members WHERE project_id = p.id AND user_id = ?) as user_role,
      (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
      (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'completed') as completed_task_count,
      (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
    FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ? OR pm.user_id = ?
    ORDER BY p.created_at DESC
  `).all(userId, userId, userId);

  const result = projects.map(p => {
    const members = db.prepare(`
      SELECT u.id, u.name, u.avatar_url, pm.role 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
    `).all(p.id);

    return {
      ...p,
      role: p.owner_id === userId ? 'Admin' : (p.user_role || 'Member'),
      members
    };
  });

  res.json({ projects: result });
});

// POST create project
router.post('/', authenticateToken, (req, res) => {
  const { name, description, color } = req.body;
  const userId = req.user.id;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  const hexColor = color || '#6366F1';

  try {
    const insertProj = db.prepare(`
      INSERT INTO projects (name, description, color, owner_id)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertProj.run(name.trim(), description || '', hexColor, userId);
    const projectId = Number(result.lastInsertRowid);

    // Automatically add owner as Admin in project_members
    db.prepare(`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (?, ?, 'Admin')
    `).run(projectId, userId);

    // Log activity
    db.prepare(`
      INSERT INTO activity_logs (project_id, user_id, action, details)
      VALUES (?, ?, 'PROJECT_CREATED', ?)
    `).run(projectId, userId, `Created project "${name.trim()}".`);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    res.status(201).json({ project: { ...project, role: 'Admin' } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project.', details: err.message });
  }
});

// GET single project details
router.get('/:id', authenticateToken, requireProjectRole(['Admin', 'Member']), (req, res) => {
  const projectId = req.params.id;

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const members = db.prepare(`
    SELECT u.id, u.name, u.email, u.avatar_url, pm.role, pm.joined_at
    FROM project_members pm
    JOIN users u ON pm.user_id = u.id
    WHERE pm.project_id = ?
    ORDER BY pm.role ASC, u.name ASC
  `).all(projectId);

  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'in_review' THEN 1 ELSE 0 END) as in_review,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
      SUM(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 ELSE 0 END) as overdue
    FROM tasks
    WHERE project_id = ?
  `).get(projectId);

  res.json({
    project: {
      ...project,
      user_role: req.projectRole,
      members,
      stats
    }
  });
});

// PUT update project (Admin only)
router.put('/:id', authenticateToken, requireProjectRole(['Admin']), (req, res) => {
  const projectId = req.params.id;
  const { name, description, color } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  db.prepare(`
    UPDATE projects
    SET name = ?, description = ?, color = ?
    WHERE id = ?
  `).run(name.trim(), description || '', color || '#6366F1', projectId);

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  res.json({ project: updated });
});

// DELETE project (Admin only)
router.delete('/:id', authenticateToken, requireProjectRole(['Admin']), (req, res) => {
  const projectId = req.params.id;

  db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
  res.json({ message: 'Project deleted successfully.' });
});

// POST Add Member (Admin only)
router.post('/:id/members', authenticateToken, requireProjectRole(['Admin']), (req, res) => {
  const projectId = req.params.id;
  const { user_id, role } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const memberRole = role === 'Admin' ? 'Admin' : 'Member';

  const user = db.prepare('SELECT id, name FROM users WHERE id = ?').get(user_id);
  if (!user) {
    return res.status(404).json({ error: 'User to add was not found.' });
  }

  try {
    db.prepare(`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (?, ?, ?)
    `).run(projectId, user_id, memberRole);

    // Log activity
    db.prepare(`
      INSERT INTO activity_logs (project_id, user_id, action, details)
      VALUES (?, ?, 'MEMBER_ADDED', ?)
    `).run(projectId, req.user.id, `Added ${user.name} to project as ${memberRole}.`);

    const members = db.prepare(`
      SELECT u.id, u.name, u.email, u.avatar_url, pm.role, pm.joined_at
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
    `).all(projectId);

    res.status(201).json({ members });
  } catch (err) {
    res.status(400).json({ error: 'User is already a member of this project.' });
  }
});

// PATCH Update Member Role (Admin only)
router.patch('/:id/members/:userId', authenticateToken, requireProjectRole(['Admin']), (req, res) => {
  const { id: projectId, userId } = req.params;
  const { role } = req.body;

  if (!['Admin', 'Member'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either "Admin" or "Member".' });
  }

  db.prepare(`
    UPDATE project_members
    SET role = ?
    WHERE project_id = ? AND user_id = ?
  `).run(role, projectId, userId);

  res.json({ message: `Role updated to ${role}.` });
});

// DELETE Remove Member (Admin only)
router.delete('/:id/members/:userId', authenticateToken, requireProjectRole(['Admin']), (req, res) => {
  const { id: projectId, userId } = req.params;

  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
  if (project && project.owner_id == userId) {
    return res.status(400).json({ error: 'Cannot remove project owner from project.' });
  }

  db.prepare(`
    DELETE FROM project_members
    WHERE project_id = ? AND user_id = ?
  `).run(projectId, userId);

  res.json({ message: 'Member removed from project.' });
});

export default router;
