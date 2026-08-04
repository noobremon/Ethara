================================================================================
ETHARA TASKFLOW - ENTERPRISE TEAM TASK MANAGER (FULL-STACK)
================================================================================

A modern, high-performance full-stack Team Task Manager web application built with 
Node.js, Express, SQLite, React, and Vite. Features Role-Based Access Control (Admin/Member), 
interactive Kanban boards, project team management, and real-time dashboard analytics.

--------------------------------------------------------------------------------
1. KEY FEATURES
--------------------------------------------------------------------------------

* AUTHENTICATION & SECURITY:
  - User Signup & Login using JWT token authentication and bcrypt password hashing.
  - Quick Demo Account Switcher pills ("Admin: Alex Mercer", "Member: Marcus Vance") 
    for instant 1-click evaluation.

* PROJECT & TEAM MANAGEMENT (RBAC):
  - Create projects with custom descriptions & color theme tags.
  - Role-Based Access Control (RBAC):
    - Admin: Full permission to edit/delete projects, manage team members, 
      change roles (Admin <-> Member), and create/edit/delete any task.
    - Member: Permission to view projects, create tasks, move task statuses 
      across Kanban columns, and edit assigned tasks.

* INTERACTIVE TASK TRACKER (KANBAN & DIRECTORY):
  - 4 Status Columns: To Do, In Progress, In Review, Completed.
  - Priority Matrix: Urgent, High, Medium, Low.
  - Real-time search, priority filters, assignee filters, and overdue task toggle.
  - Tabular directory list view for structured data auditing and status updates.

* DASHBOARD ANALYTICS & AUDIT TRAIL:
  - KPI Metrics: Total Tasks, In Progress, Completed, Overdue Task Count.
  - Animated SVG Completion Rate ring chart.
  - Overdue deliverable spotlight panel with quick resolution buttons.
  - Real-time audit activity feed logging team actions.

* LUXURY DARK UI DESIGN SYSTEM:
  - Obsidian dark palette (#0B0F19) with glassmorphism cards (backdrop-filter: blur).
  - Micro-animations, glowing status badges, Outfit & Plus Jakarta Sans typography.

--------------------------------------------------------------------------------
2. TECH STACK & REST API ENDPOINTS
--------------------------------------------------------------------------------

- Frontend: React 18, Vite, Lucide Icons, Tailwind CSS / Custom Glassmorphism.
- Backend: Node.js, Express REST API, SQLite (node:sqlite DatabaseSync), JWT, BcryptJS.

REST API Endpoints:
- POST   /api/auth/signup                     : User registration
- POST   /api/auth/login                      : User login
- GET    /api/auth/me                         : Current user profile
- GET    /api/projects                        : List user's projects with task counts & roles
- POST   /api/projects                        : Create new project
- POST   /api/projects/:id/members            : Add member to project (Admin)
- PATCH  /api/projects/:id/members/:userId    : Update member role (Admin)
- DELETE /api/projects/:id/members/:userId    : Remove member (Admin)
- GET    /api/tasks                           : List tasks with query filters
- POST   /api/tasks                           : Create new task
- PUT    /api/tasks/:id                       : Edit task details
- PATCH  /api/tasks/:id/status                : Move task status
- DELETE /api/tasks/:id                       : Delete task (Admin)
- GET    /api/dashboard/stats                 : Workspace analytics & activity feed

--------------------------------------------------------------------------------
3. HOW TO RUN LOCALLY
--------------------------------------------------------------------------------

Step 1: Install All Dependencies
   npm run install:all

Step 2: Start Development Servers (Express API on Port 5000 + Vite UI on Port 3000)
   npm run dev

Step 3: Open Browser
   Navigate to: http://localhost:3000

Demo Login Credentials:
- Admin Account  : admin@ethara.com  / password123
- Member Account : member@ethara.com / password123

--------------------------------------------------------------------------------
4. HOW TO DEPLOY ON RENDER.COM
--------------------------------------------------------------------------------

Option A: 1-Click Blueprint (Recommended)
1. Push your repository to GitHub.
2. Log into Render Dashboard (https://dashboard.render.com/).
3. Click "New +" -> "Blueprint".
4. Connect your repository. Render will automatically detect render.yaml:
   - Build Command : npm run build
   - Start Command : npm run start
5. Click "Apply" to deploy!

Option B: Manual Web Service Setup
1. Push repository to GitHub.
2. In Render, click "New +" -> "Web Service".
3. Connect your repository.
4. Set Configuration:
   - Environment   : Node
   - Build Command : npm run build
   - Start Command : npm run start
5. Add Environment Variables under Advanced:
   - NODE_ENV   = production
   - JWT_SECRET = your_super_secret_jwt_key
6. Click "Create Web Service".

Git Push Commands:
   git add .
   git commit -m "Deploy Ethara Task Manager to Render"
   git push
================================================================================
