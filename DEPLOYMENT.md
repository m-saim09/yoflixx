# Yoflixx Production Deployment Guide

Complete step-by-step guide to deploy the Yoflixx MERN stack using **free tiers only**:

| Layer    | Service        | Free Tier                          |
|----------|----------------|------------------------------------|
| Frontend | Vercel         | Hobby (free)                       |
| Backend  | Render         | Free Web Service                   |
| Database | MongoDB Atlas  | M0 Shared Cluster (512 MB)         |

---

## Architecture

```
Browser → Vercel (React / TanStack Start SSR)
              ↓ HTTPS API calls
         Render (Express API)
              ↓ Mongoose
         MongoDB Atlas (M0)
```

---

## Prerequisites

- [GitHub](https://github.com) account
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account
- Node.js 20+ installed locally

---

## Step 1 — Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `yoflixx` (or your preferred name)
3. Set visibility to **Public** or **Private**
4. Do **not** initialize with README (project already exists locally)

---

## Step 2 — Push Project to GitHub

From the project root (`d:\yoflixx`):

```powershell
git init
git add .
git commit -m "Prepare Yoflixx for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yoflixx.git
git push -u origin main
```

> **Important:** `.env` files are gitignored. Never commit secrets.

---

## Step 3 — Create MongoDB Atlas Free M0 Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Build a Database**
3. Choose **M0 FREE** (Shared)
4. Select a cloud provider and region close to your Render region (e.g. `AWS / N. Virginia`)
5. Cluster name: `Cluster0` (default is fine)
6. Click **Create**

---

## Step 4 — Create Database

The database name is set in the connection string. This project uses:

```
yoflix
```

You do not need to manually create collections — Mongoose creates them on first write.

---

## Step 5 — Create Database User

1. In Atlas, go to **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: e.g. `yoflixx_admin`
4. Password: generate a strong password (save it securely)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

---

## Step 6 — Get MongoDB Connection String

1. Go to **Database** → **Connect** on your cluster
2. Choose **Drivers** → **Node.js**
3. Copy the connection string:

```
mongodb+srv://yoflixx_admin:<password>@cluster0.xxxxx.mongodb.net/yoflix?retryWrites=true&w=majority
```

4. Replace `<password>` with your actual password (URL-encode special characters)

### Network Access (required for Render)

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Required because Render free tier uses dynamic IPs

---

## Step 7 — Configure Backend Environment Variables

Copy the example file locally (for reference only — production vars go in Render):

```powershell
copy backend\.env.example backend\.env
```

Production values:

| Variable     | Value                                              |
|--------------|----------------------------------------------------|
| `PORT`       | `5000`                                             |
| `NODE_ENV`   | `production`                                       |
| `MONGODB_URI`| Your Atlas connection string from Step 6           |
| `JWT_SECRET` | Long random string (32+ chars)                     |
| `CLIENT_URL` | Your Vercel URL (set after Step 11)              |

> **Remove** `DATABASE_PROVIDER=file` — that is for local dev only and is blocked in production.

Generate a JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Step 8 — Deploy Backend to Render

### Option A — Blueprint (recommended)

1. Push `render.yaml` from the repo root (already included)
2. In Render dashboard → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates the web service

### Option B — Manual

1. Render dashboard → **New** → **Web Service**
2. Connect GitHub repo
3. Settings:

| Setting          | Value              |
|------------------|--------------------|
| Name             | `yoflixx-api`      |
| Root Directory   | `backend`          |
| Runtime          | Node               |
| Build Command    | `npm install --omit=dev` |
| Start Command    | `npm start`        |
| Plan             | **Free**           |

---

## Step 9 — Configure Render Environment Variables

In Render → your service → **Environment**:

| Key           | Value                                      |
|---------------|--------------------------------------------|
| `NODE_ENV`    | `production`                               |
| `PORT`        | `5000`                                     |
| `MONGODB_URI` | `mongodb+srv://...` (from Step 6)          |
| `JWT_SECRET`  | Your random secret from Step 7             |
| `CLIENT_URL`  | `https://your-app.vercel.app` (Step 11)    |

Click **Save Changes** — Render redeploys automatically.

Optional (admin panel on a separate Vercel project):

| Key           | Value                                      |
|---------------|--------------------------------------------|
| `CORS_ORIGIN` | `https://your-admin.vercel.app`            |

---

## Step 10 — Verify Backend Deployment

After Render shows **Live**, test these endpoints:

```powershell
# Health check
curl https://YOUR-BACKEND.onrender.com/health

# API health (legacy alias)
curl https://YOUR-BACKEND.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "API healthy",
  "data": {
    "timestamp": "...",
    "uptime": 123,
    "database": "connected"
  }
}
```

> **Note:** Render free tier spins down after 15 min idle. First request may take ~30–60 seconds (cold start).

### Seed production database (one-time)

From Render **Shell** or locally with production `MONGODB_URI`:

```powershell
cd backend
$env:MONGODB_URI="mongodb+srv://..."
$env:JWT_SECRET="your-secret"
npm run seed
```

Default admin credentials (change password after first login):

- Email: `admin@yoflixx.com`
- Password: `admin123`

---

## Step 11 — Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:

| Setting          | Value              |
|------------------|--------------------|
| Framework Preset | **Other**          |
| Root Directory   | `frontend`         |
| Build Command    | `npm run build`    |
| Output Directory | *(leave empty — Nitro uses Build Output API)* |

4. Do **not** deploy yet — add environment variables first (Step 12)

---

## Step 12 — Configure Vercel Environment Variables

In Vercel → Project → **Settings** → **Environment Variables**:

| Key            | Value                                   | Environments   |
|----------------|-----------------------------------------|----------------|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com`     | Production     |

> No trailing slash. `/api` is appended automatically by the frontend.

Redeploy after adding variables.

---

## Step 13 — Connect Frontend with Backend

1. Copy your Vercel production URL (e.g. `https://yoflixx.vercel.app`)
2. Go back to **Render** → Environment → update `CLIENT_URL`:

```
CLIENT_URL=https://yoflixx.vercel.app
```

3. Render redeploys with correct CORS settings
4. Vercel rebuilds if you changed `VITE_API_URL`

---

## Step 14 — Test Authentication

Admin panel (`admin/` folder) can be deployed as a second Vercel project with the same `VITE_API_URL`.

Test login via API:

```powershell
curl -X POST https://YOUR-BACKEND.onrender.com/api/admin/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@yoflixx.com","password":"admin123"}'
```

Expected: `{ "success": true, "token": "...", "data": { "admin": {...} } }`

---

## Step 15 — Test CRUD Operations

### Create contact (public)

```powershell
curl -X POST https://YOUR-BACKEND.onrender.com/api/contacts `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","message":"Hello from production"}'
```

### Read pricing plans

```powershell
curl https://YOUR-BACKEND.onrender.com/api/pricing
```

### Read website settings

```powershell
curl https://YOUR-BACKEND.onrender.com/api/settings
```

---

## Step 16 — Test Database Connectivity

Check the health endpoint — `database` should be `"connected"`:

```powershell
curl https://YOUR-BACKEND.onrender.com/health
```

In MongoDB Atlas → **Browse Collections**, verify data appears after seed/CRUD tests.

---

## Step 17 — Test Production Build

### Frontend (local)

```powershell
cd frontend
npm run build
```

Build output: `.vercel/output/` (Vercel-ready)

### Backend (local production simulation)

```powershell
cd backend
$env:NODE_ENV="production"
$env:MONGODB_URI="mongodb+srv://..."
$env:JWT_SECRET="your-secret"
npm start
```

---

## Step 18 — Fix Common Deployment Issues

| Issue | Fix |
|-------|-----|
| CORS error in browser | Set `CLIENT_URL` in Render to exact Vercel URL (no trailing slash) |
| `database: disconnected` | Check `MONGODB_URI`, Atlas IP whitelist (`0.0.0.0/0`), user password |
| 502 / timeout on Render | Free tier cold start — wait 60s and retry |
| `DATABASE_PROVIDER=file` error | Remove from Render env vars |
| Frontend calls wrong API | Set `VITE_API_URL` in Vercel, redeploy |
| Auth cookie not working cross-origin | Admin uses Bearer token in localStorage (already configured) |
| Build fails on Vercel | Ensure Root Directory is `frontend`, Node 20+ |

---

## Final URLs (fill in after deployment)

| Service   | URL |
|-----------|-----|
| Frontend  | `https://________________.vercel.app` |
| Backend   | `https://________________.onrender.com` |
| MongoDB   | `cluster0.xxxxx.mongodb.net` / database: `yoflix` |

---

## Required Environment Variables Summary

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (Render)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yoflix?retryWrites=true&w=majority
JWT_SECRET=your-long-random-secret
CLIENT_URL=https://your-vercel-domain.vercel.app
```

---

## Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] MongoDB Atlas M0 cluster running
- [ ] Database user created with read/write access
- [ ] Network Access allows `0.0.0.0/0`
- [ ] Render backend deployed and `/health` returns `connected`
- [ ] `DATABASE_PROVIDER=file` **not** set in production
- [ ] JWT_SECRET is a strong random value
- [ ] Database seeded (`npm run seed`)
- [ ] Vercel frontend deployed with `VITE_API_URL`
- [ ] `CLIENT_URL` in Render matches Vercel URL exactly
- [ ] Contact form submits successfully
- [ ] Pricing page loads from API
- [ ] Admin login works
- [ ] Default admin password changed

---

## Production Best Practices

1. **Secrets** — Never commit `.env` files. Rotate `JWT_SECRET` if exposed.
2. **CORS** — Only allow your Vercel domain via `CLIENT_URL`. Add admin URL via `CORS_ORIGIN` if needed.
3. **Rate limiting** — Enabled on all `/api` routes (200 req/15 min) and login (20 req/15 min).
4. **Helmet** — Security headers enabled in production.
5. **Compression** — Gzip enabled for all responses.
6. **MongoDB** — Connection pooling, retry logic (5 attempts), and auto-reconnect configured.
7. **Health checks** — Render uses `/health` for uptime monitoring.
8. **Cold starts** — Render free tier sleeps after inactivity. Consider UptimeRobot (free) to ping `/health` every 14 minutes.
9. **Admin password** — Change default `admin123` immediately after seeding.
10. **Atlas backups** — M0 has no continuous backup; export important data periodically.

---

## Optional: Deploy Admin Panel

The `admin/` folder is a separate TanStack Start app. Deploy it as a second Vercel project:

- Root Directory: `admin`
- Build Command: `npm run build`
- Env: `VITE_API_URL=https://your-backend.onrender.com`
- Add admin URL to Render `CORS_ORIGIN`

---

## Project Structure

```
yoflixx/
├── frontend/          → Vercel (public website)
├── admin/             → Vercel (optional admin dashboard)
├── backend/           → Render (Express API)
├── render.yaml        → Render Blueprint config
└── DEPLOYMENT.md      → This guide
```
