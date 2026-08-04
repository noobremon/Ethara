import { Router } from 'express';
import db from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Projects user belongs to
  const userProjects = db.prepare(`
    SELECT DISTINCT p.id 
    FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ? OR pm.user_id = ?
  `).all(userId, userId).map(p => p.id);

  if (userProjects.length === 0) {
    return res.json({
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasksCount: 0,
      completionRate: 0,
      statusBreakdown: { todo: 0, in_progress: 0, in_review: 0, completed: 0 },
      priorityBreakdown: { urgent: 0, high: 0, medium: 0, low: 0 },
      overdueTasksList: [],
      recentActivities: []
    });
  }

  const projectIdsPlaceholders = userProjects.map(() => '?').join(',');

  // Metrics
  const metrics = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'in_review' THEN 1 ELSE 0 END) as in_review,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
      SUM(CASE WHEN due_date IS NOT NULL AND DATE(due_date) < DATE('now') AND status != 'completed' THEN 1 ELSE 0 END) as overdue,
      SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as p_urgent,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as p_high,
      SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as p_medium,
      SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as p_low
    FROM tasks
    WHERE project_id IN (${projectIdsPlaceholders})
  `).get(...userProjects);

  // Overdue task details list
  const overdueTasksList = db.prepare(`
    SELECT t.*, p.name as project_name, p.color as project_color, u.name as assignee_name, u.avatar_url as assignee_avatar
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.project_id IN (${projectIdsPlaceholders})
      AND t.due_date IS NOT NULL 
      AND DATE(t.due_date) < DATE('now')
      AND t.status != 'completed'
    ORDER BY t.priority = 'urgent' DESC, t.due_date ASC
    LIMIT 5
  `).all(...userProjects);

  // Recent activity logs
  const recentActivities = db.prepare(`
    SELECT a.*, u.name as user_name, u.avatar_url as user_avatar, p.name as project_name, t.title as task_title
    FROM activity_logs a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN projects p ON a.project_id = p.id
    LEFT JOIN tasks t ON a.task_id = t.id
    WHERE a.project_id IN (${projectIdsPlaceholders})
    ORDER BY a.created_at DESC
    LIMIT 10
  `).all(...userProjects);

  const total = metrics.total || 0;
  const completed = metrics.completed || 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    totalTasks: total,
    completedTasks: completed,
    inProgressTasks: metrics.in_progress || 0,
    overdueTasksCount: metrics.overdue || 0,
    completionRate,
    statusBreakdown: {
      todo: metrics.todo || 0,
      in_progress: metrics.in_progress || 0,
      in_review: metrics.in_review || 0,
      completed: completed
    },
    priorityBreakdown: {
      urgent: metrics.p_urgent || 0,
      high: metrics.p_high || 0,
      medium: metrics.p_medium || 0,
      low: metrics.p_low || 0
    },
    overdueTasksList,
    recentActivities
  });
});

export default router;
