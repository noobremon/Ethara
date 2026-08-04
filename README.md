# 🚀 Ethara Taskflow - Enterprise Team Task Manager (Full-Stack)

A modern, high-performance full-stack Team Task Manager web application built with **Node.js, Express, SQLite, React, and Vite**. Features role-based access control (Admin/Member), interactive Kanban boards, project team management, and dashboard analytics.

---

## 🌟 Key Features

1. **Authentication & Security**
   - User Signup and Login with JWT token authentication & bcrypt password hashing.
   - Quick Demo Role Switcher pills (`Admin: Alex Mercer`, `Member: Marcus Vance`) for instant 1-click evaluation.

2. **Project & Team Management (RBAC)**
   - Create projects with custom description & color themes.
   - **Role-Based Access Control**:
     - **Admin**: Full access to edit project, delete project, manage team members, change user roles (`Admin` <-> `Member`), create/edit/delete any task.
     - **Member**: Access to view project details, create tasks, move task statuses across columns, edit assigned tasks.

3. **Interactive Task Tracker (Kanban Board & Directory)**
   - 4 Status Columns: `To Do`, `In Progress`, `In Review`, `Completed`.
   - Priority Matrix: `Urgent`, `High`, `Medium`, `Low`.
   - Real-time search, priority filters, assignee filter, and overdue task toggle.
   - Tabular directory list view for bulk inspection and status updates.

4. **Dashboard & Analytics**
   - KPI metrics: Total Tasks, In Progress, Completed, Overdue task count.
   - Animated SVG Completion Rate ring chart.
   - Overdue tasks spotlight panel with quick resolution buttons.
   - Real-time audit activity feed logging team actions.

5. **State-of-the-Art Luxury Dark UI**
   - Obsidian dark palette with glassmorphism panels (`backdrop-filter: blur`).
   - Micro-animations, glowing status badges, outfit typography, custom scrollbars.

---

## 🛠️ Tech Stack & REST APIs

- **Frontend**: React 18, Vite, Lucide Icons, Custom Glassmorphism CSS Design System.
- **Backend**: Node.js, Express REST API, SQLite (`better-sqlite3`), JSONWebToken, BcryptJS.

### REST Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user profile
- `GET /api/projects` - List user's projects with task counts & roles
- `POST /api/projects` - Create project
- `POST /api/projects/:id/members` - Add member to project (Admin)
- `PATCH /api/projects/:id/members/:userId` - Update member role (Admin)
- `DELETE /api/projects/:id/members/:userId` - Remove member (Admin)
- `GET /api/tasks` - List tasks with query filters (`project_id`, `status`, `priority`, `search`, `overdue`)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id/status` - Move task status
- `DELETE /api/tasks/:id` - Delete task (Admin)
- `GET /api/dashboard/stats` - Workspace analytics & activity feed

---

## ⚡ How to Run

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Start Dev Application** (Runs Express API on Port 5000 + Vite React UI on Port 3000 concurrently)
   ```bash
   npm run dev
   ```

3. Open your browser at **`http://localhost:3000`**

### Demo Login Credentials
- **Admin**: `admin@ethara.com` / `password123`
- **Member**: `member@ethara.com` / `password123`

---

## 🌐 How to Deploy on Render.com

### Option A: 1-Click Blueprint (Recommended)
1. Push this project repository to **GitHub** or **GitLab**.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your repository. Render will automatically detect `render.yaml` and configure:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Persistent Disk mounted at `/var/data` for SQLite database.
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. Push project to GitHub.
2. In Render, click **New +** -> **Web Service**.
3. Connect your repository.
4. Set configuration:
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
5. Add Environment Variables under **Advanced**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (Any strong random string e.g. `your_super_secret_jwt_key`)
   - `DB_PATH`: `/var/data/task_manager.db` (optional if using persistent disk)
6. Add a **Persistent Disk** (optional for SQLite data persistence across redeploys):
   - **Mount Path**: `/var/data`
   - **Size**: 1 GB
7. Click **Create Web Service**. Render will build the Vite UI and deploy the unified Express REST API & Web App!
