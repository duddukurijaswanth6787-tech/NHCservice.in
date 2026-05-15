# NHCservice - Production Deployment & Audit Guide

This guide contains the final, validated configuration and deployment steps for NHCservice. The project has undergone a complete production audit and is now investor-grade.

## 📋 Production Readiness Checklist
- [x] Environment variables validated and masked in logs.
- [x] Security headers (Helmet) and CORS protection active.
- [x] Rate limiting configured for API and Auth routes.
- [x] Database (MongoDB) connection includes retry logic.
- [x] AI Prompt Injection protection implemented in AIService.
- [x] Frontend optimized with manual chunk splitting and compression.
- [x] Backend performance enhanced with `compression` middleware.
- [x] CI/CD pipeline configured for automated zero-downtime deployment.

---

## 🛠 Deployment Steps

### 1. MongoDB Atlas Setup
1. Create a new Cluster (Shared/Dedicated).
2. Create a database named `nhcservice`.
3. Create a Database User with read/write access.
4. Whitelist all IPs (`0.0.0.0/0`) or specific Railway outbound IPs.
5. Copy the Connection String for the `.env`.

### 2. Redis Cloud Setup
1. Create a free/dedicated Redis instance on Redis.com.
2. Note the public endpoint and password.
3. Use the `redis://...` format for the `REDIS_URL`.

### 3. Railway (Backend Deployment)
1. Connect your GitHub repository.
2. Select the `backend` directory as the root.
3. Railway will automatically use the `Dockerfile`.
4. Add all environment variables from `backend/.env.example`.
5. **Critical:** Ensure `PORT` is set to `5001`.

### 4. Vercel (Frontend Deployment)
1. Connect your GitHub repository.
2. Select the `frontend` directory.
3. Configure the build command: `npm run build`.
4. Configure the output directory: `dist`.
5. Add the `VITE_API_URL` variable (Point to your Railway URL).

---

## 🛡 Security & Hardening
- **JWT:** Tokens are signed with a 24h expiry.
- **Headers:** Nginx and Express both provide `nosniff`, `X-Frame-Options`, and `HSTS`.
- **Masking:** Sensitive user data (passwords, tokens) is never logged in the Winston transport.

---

## 📊 Monitoring & Logging
- **Logs:** View live logs in the Railway Dashboard or via `pm2 logs` if using a VPS.
- **Monitoring:** Recommended to add **Sentry.io** for frontend error tracking and **New Relic** for backend APM.

---

## 🔄 Backup & Recovery
- **Database:** Enable automated snapshots in MongoDB Atlas (daily backups).
- **Environment:** Keep a secure, encrypted copy of your production `.env` file in a vault (e.g., 1Password or GitHub Secrets).

---
*NHCservice Production Audit Complete | Status: STABLE*
