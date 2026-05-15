# NHCservice - AI-Powered Women's Wellness Platform

NHCservice is a professional, full-stack application designed for menstrual health care and seed cycling wellness. It combines a premium React frontend with a secure Node.js backend and advanced AI integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Redis Cloud Account
- Gemini / OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd cycle-harmony-laddus-main
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Update .env with your credentials
   npm install
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

## 🏗 Architecture
For a deep dive into the system design, see [NHCSERVICE_ARCHITECTURE.md](./NHCSERVICE_ARCHITECTURE.md).

## 🛠 Tech Stack
- **Frontend:** React, Vite, TypeScript, TailwindCSS, Zustand.
- **Backend:** Node.js, Express, MongoDB, Redis, JWT.
- **AI:** Google Gemini 2.0 Flash Lite / OpenAI.
- **DevOps:** Docker, Vercel, Railway, GitHub Actions.

## 🔒 Security
- JWT Authentication with Refresh Token flow.
- Global request/response logging.
- Role-Based Access Control (RBAC).
- Helmet security headers and Rate Limiting.

## 📄 License
This project is proprietary and confidential.

---
Built with ❤️ by the NHCservice Engineering Team.
