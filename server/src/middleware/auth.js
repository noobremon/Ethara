import jwt from 'jsonwebtoken';
import db from '../db/index.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ethara_super_secret_jwt_key_2026_dev';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
  }

  try {
    const verifiedUser = jwt.verify(token, JWT_SECRET);
    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireProjectRole(allowedRoles = ['Admin', 'Member']) {
  return (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.projectId || req.params.id || req.query.project_id || req.body.project_id;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required for access verification.' });
    }

    // Check if project exists
    const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Project owner is automatically Admin
    if (project.owner_id === userId) {
      req.projectRole = 'Admin';
      return next();
    }

    // Check member role
    const member = db.prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?')
      .get(projectId, userId);

    if (!member) {
      return res.status(403).json({ error: 'Access denied. You are not a member of this project.' });
    }

    if (!allowedRoles.includes(member.role)) {
      return res.status(403).json({ 
        error: `Access denied. Action requires '${allowedRoles.join(' or ')}' role. Your role is '${member.role}'.` 
      });
    }

    req.projectRole = member.role;
    next();
  };
}
