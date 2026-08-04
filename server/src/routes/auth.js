import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

// Signup
router.post('/signup', (req, res) => {
  const { name, email, password, avatar_url } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'A user with this email address already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);
  const avatar = avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, avatar_url)
      VALUES (?, ?, ?, ?)
    `).run(name, email.toLowerCase(), password_hash, avatar);

    const userId = Number(result.lastInsertRowid);
    const user = { id: userId, name, email: email.toLowerCase(), avatar_url: avatar };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user account.', details: err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload });
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user });
});

// Get All Users (for dropdowns / inviting members)
router.get('/users', authenticateToken, (req, res) => {
  const users = db.prepare('SELECT id, name, email, avatar_url FROM users ORDER BY name ASC').all();
  res.json({ users });
});

export default router;
