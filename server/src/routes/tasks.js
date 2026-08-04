import { Router } from 'express';
import db from '../db/index.js';
import { authenticateToken, requireProjectRole } from '../middleware/auth.js';

const router = Router();

// GET all tasks (filtered by user access + query params)
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { project_id, status, priority, assignee_id, search, overdue } = req.query;

  let sql = `
    SELECT t.*, 
      p.name as project_name, p.color as project_color,
      u_assignee.name as assignee_name, u_assignee.avatar_url as assignee_avatar,
      u_creator.name as creator_name, u_creator.avatar_url as creator_avatar,
      CASE WHEN t.due_date IS NOT NULL AND DATE(t.due_date) < DATE('now') AND t.status != 'completed' THEN 1 ELSE 0 END as is_overdue
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    JOIN project_members pm ON p.id = pm.project_id
    LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
    LEFT JOIN users u_creator ON t.creator_id = u_creator.id
    WHERE pm.user_id = ?
  `;

  const params = [userId];

  if (project_id) {
    sql += ` AND t.project_id = ?`;
    params.push(project_id);
  }

  if (status) {
    sql += ` AND t.status = ?`;
    params.push(status);
  }

  if (priority) {
    sql += ` AND t.priority = ?`;
    params.push(priority);
  }

  if (assignee_id) {
    sql += ` AND t.assignee_id = ?`;
    params.push(assignee_id);
  }

  if (overdue === 'true') {
    sql += ` AND t.due_date IS NOT NULL AND DATE(t.due_date) < DATE('now') AND t.status != 'completed'`;
  }

  if (search) {
    sql += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END, t.due_date ASC`;

  const tasks = db.prepare(sql).all(...params);
  res.json({ tasks });
});

// POST Create task
router.post('/', authenticateToken, requireProjectRole(['Admin', 'Member']), (req, res) => {
  const { project_id, title, description, status, priority, assignee_id, due_date } = req.body;
  const creator_id = req.user.id;

  if (!project_id || !title || !title.trim()) {
    return res.status(400).json({ error: 'Project ID and task title are required.' });
  }

  const validStatus = ['todo', 'in_progress', 'in_review', 'completed'].includes(status) ? status : 'todo';
  const validPriority = ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : 'medium';

  try {
    const result = db.prepare(`
      INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, creator_id, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      project_id,
      title.trim(),
      description || '',
      validStatus,
      validPriority,
      assignee_id || null,
      creator_id,
      due_date || null
    );

    const taskId = Number(result.lastInsertRowid);

    // Log Activity
    db.prepare(`
      INSERT INTO activity_logs (project_id, task_id, user_id, action, details)
      VALUES (?, ?, ?, 'TASK_CREATED', ?)
    `).run(project_id, taskId, creator_id, `Created task "${title.trim()}".`);

    const task = db.prepare(`
      SELECT t.*, 
        p.name as project_name, p.color as project_color,
        u_assignee.name as assignee_name, u_assignee.avatar_url as assignee_avatar
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
      WHERE t.id = ?
    `).get(taskId);

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task.', details: err.message });
  }
});

// GET single task details
router.get('/:id', authenticateToken, (req, res) => {
  const task = db.prepare(`
    SELECT t.*, 
      p.name as project_name, p.color as project_color,
      u_assignee.name as assignee_name, u_assignee.avatar_url as assignee_avatar,
      u_creator.name as creator_name, u_creator.avatar_url as creator_avatar
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
    LEFT JOIN users u_creator ON t.creator_id = u_creator.id
    WHERE t.id = ?
  `).get(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  res.json({ task });
});

// PUT Update Task
router.put('/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, priority, assignee_id, due_date } = req.body;

  const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!existingTask) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const member = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?')
    .get(existingTask.project_id, req.user.id);
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(existingTask.project_id);

  const isOwnerOrAdmin = (project && project.owner_id === req.user.id) || (member && member.role === 'Admin');
  const isAssignee = existingTask.assignee_id === req.user.id;

  if (!isOwnerOrAdmin && !isAssignee) {
    return res.status(403).json({ error: 'Permission denied. Only Admins or assigned Members can edit this task.' });
  }

  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, status = ?, priority = ?, assignee_id = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title || existingTask.title,
    description !== undefined ? description : existingTask.description,
    status || existingTask.status,
    priority || existingTask.priority,
    assignee_id !== undefined ? assignee_id : existingTask.assignee_id,
    due_date !== undefined ? due_date : existingTask.due_date,
    taskId
  );

  if (status && status !== existingTask.status) {
    db.prepare(`
      INSERT INTO activity_logs (project_id, task_id, user_id, action, details)
      VALUES (?, ?, ?, 'STATUS_UPDATED', ?)
    `).run(existingTask.project_id, taskId, req.user.id, `Changed status from ${existingTask.status} to ${status}.`);
  }

  const updated = db.prepare(`
    SELECT t.*, 
      p.name as project_name, p.color as project_color,
      u_assignee.name as assignee_name, u_assignee.avatar_url as assignee_avatar
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u_assignee ON t.assignee_id = u_assignee.id
    WHERE t.id = ?
  `).get(taskId);

  res.json({ task: updated });
});

// PATCH Quick Status Change (Kanban Move)
router.patch('/:id/status', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!['todo', 'in_progress', 'in_review', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!existingTask) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  db.prepare(`
    UPDATE tasks
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, taskId);

  db.prepare(`
    INSERT INTO activity_logs (project_id, task_id, user_id, action, details)
    VALUES (?, ?, ?, 'STATUS_UPDATED', ?)
  `).run(existingTask.project_id, taskId, req.user.id, `Updated task status to "${status.replace('_', ' ')}".`);

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.json({ task: updated });
});

// DELETE Task (Admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const task = db.prepare('SELECT project_id FROM tasks WHERE id = ?').get(taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const member = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?')
    .get(task.project_id, req.user.id);
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(task.project_id);

  if (project.owner_id !== req.user.id && (!member || member.role !== 'Admin')) {
    return res.status(403).json({ error: 'Permission denied. Only Project Admins can delete tasks.' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  res.json({ message: 'Task deleted successfully.' });
});

export default router;
