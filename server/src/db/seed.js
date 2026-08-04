import db from './index.js';
import bcrypt from 'bcryptjs';

export function seedDb() {
  // Clear existing tables
  db.exec('DELETE FROM activity_logs');
  db.exec('DELETE FROM tasks');
  db.exec('DELETE FROM project_members');
  db.exec('DELETE FROM projects');
  db.exec('DELETE FROM users');

  try {
    db.exec(`DELETE FROM sqlite_sequence WHERE name IN ('users', 'projects', 'project_members', 'tasks', 'activity_logs')`);
  } catch (e) {
    // Ignore if sqlite_sequence doesn't exist yet
  }

  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('password123', salt);

  // 1. Insert Users
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, avatar_url)
    VALUES (?, ?, ?, ?)
  `);

  const user1 = Number(insertUser.run('Alex Mercer (Admin)', 'admin@ethara.com', defaultPasswordHash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex').lastInsertRowid);
  const user2 = Number(insertUser.run('Sarah Connor (Lead Dev)', 'dev@ethara.com', defaultPasswordHash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah').lastInsertRowid);
  const user3 = Number(insertUser.run('Elena Rostova (UI/UX)', 'designer@ethara.com', defaultPasswordHash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena').lastInsertRowid);
  const user4 = Number(insertUser.run('Marcus Vance (Member)', 'member@ethara.com', defaultPasswordHash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus').lastInsertRowid);

  // 2. Insert Projects
  const insertProject = db.prepare(`
    INSERT INTO projects (name, description, color, owner_id)
    VALUES (?, ?, ?, ?)
  `);

  const project1 = Number(insertProject.run(
    'Ethara Cloud Platform v2.0',
    'Next-gen microservices & dashboard redesign for enterprise teams.',
    '#6366F1',
    user1
  ).lastInsertRowid);

  const project2 = Number(insertProject.run(
    'Mobile Application Relaunch',
    'iOS & Android native task tracking app with offline sync capability.',
    '#EC4899',
    user2
  ).lastInsertRowid);

  const project3 = Number(insertProject.run(
    'AI Workflow Automation',
    'Integrating Deepmind LLM endpoints for smart task prioritization.',
    '#8B5CF6',
    user1
  ).lastInsertRowid);

  // 3. Add Project Members with Roles
  const insertMember = db.prepare(`
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (?, ?, ?)
  `);

  // Project 1 Members
  insertMember.run(project1, user1, 'Admin');
  insertMember.run(project1, user2, 'Admin');
  insertMember.run(project1, user3, 'Member');
  insertMember.run(project1, user4, 'Member');

  // Project 2 Members
  insertMember.run(project2, user2, 'Admin');
  insertMember.run(project2, user3, 'Member');
  insertMember.run(project2, user4, 'Member');

  // Project 3 Members
  insertMember.run(project3, user1, 'Admin');
  insertMember.run(project3, user2, 'Member');
  insertMember.run(project3, user4, 'Member');

  // Helper dates
  const now = new Date();
  const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const soonDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 4. Insert Tasks
  const insertTask = db.prepare(`
    INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, creator_id, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const t1 = Number(insertTask.run(
    project1,
    'Implement JWT Authentication & RBAC Middleware',
    'Configure Express token validation and project level Admin/Member checks.',
    'completed',
    'urgent',
    user2,
    user1,
    yesterday
  ).lastInsertRowid);

  const t2 = Number(insertTask.run(
    project1,
    'Design Glassmorphic Dashboard Wireframes',
    'Create sleek Figma components with high blur effect and glowing dark accent borders.',
    'in_progress',
    'high',
    user3,
    user1,
    soonDate
  ).lastInsertRowid);

  const t3 = Number(insertTask.run(
    project1,
    'Fix Database SQLite FK Migration Bug',
    'OVERDUE: Resolve missing foreign key constraints on task assignee deletion.',
    'todo',
    'urgent',
    user2,
    user1,
    pastDate
  ).lastInsertRowid);

  const t4 = Number(insertTask.run(
    project1,
    'Set up Automated Visual Verification Tests',
    'Add Playwright integration tests for Kanban board column drag and state persistence.',
    'in_review',
    'medium',
    user4,
    user2,
    nextWeek
  ).lastInsertRowid);

  const t5 = Number(insertTask.run(
    project1,
    'Optimize REST API Endpoint Latency',
    'Benchmark queries for dashboard metric aggregations and add index caching.',
    'todo',
    'low',
    user4,
    user1,
    nextWeek
  ).lastInsertRowid);

  // Project 2 Tasks
  const t6 = Number(insertTask.run(
    project2,
    'Build Native Swift & Kotlin Biometric Auth',
    'Integrate FaceID and Fingerprint API modules into mobile starter kit.',
    'in_progress',
    'high',
    user2,
    user2,
    soonDate
  ).lastInsertRowid);

  const t7 = Number(insertTask.run(
    project2,
    'Fix Push Notification Sync Timeout',
    'OVERDUE: WebSockets disconnecting when device enters low-power background mode.',
    'todo',
    'urgent',
    user4,
    user2,
    yesterday
  ).lastInsertRowid);

  const t8 = Number(insertTask.run(
    project2,
    'App Store & Play Store Screenshots',
    'Generate stunning dark-mode promotional banners for release build.',
    'completed',
    'medium',
    user3,
    user2,
    yesterday
  ).lastInsertRowid);

  // 5. Insert Activity Logs
  const insertActivity = db.prepare(`
    INSERT INTO activity_logs (project_id, task_id, user_id, action, details)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertActivity.run(project1, t1, user2, 'TASK_COMPLETED', 'Marked "Implement JWT Authentication & RBAC Middleware" as completed.');
  insertActivity.run(project1, t3, user1, 'TASK_CREATED', 'Created task "Fix Database SQLite FK Migration Bug" with Urgent priority.');
  insertActivity.run(project1, t2, user3, 'STATUS_UPDATED', 'Moved "Design Glassmorphic Dashboard Wireframes" to In Progress.');
  insertActivity.run(project2, t7, user2, 'MEMBER_ASSIGNED', 'Assigned "Fix Push Notification Sync Timeout" to Marcus Vance.');

  console.log('✅ Database successfully seeded with demo users, projects, tasks & activity logs!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDb();
}
