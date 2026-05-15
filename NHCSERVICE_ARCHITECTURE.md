# NHCservice - Enterprise AI Healthcare Architecture

## 1. Project Overview
NHCservice is an enterprise-grade AI-powered healthcare and women wellness platform. It leverages advanced AI models (Gemini/OpenAI) to provide personalized health guidance, automated customer support, and seamless integrations with WhatsApp and other automation tools.

### Core Aim
To bridge the gap between healthcare data and actionable wellness guidance through an intelligent, scalable, and secure ecosystem.

---

## 2. Technical Architecture

### High-Level Flow
`Users -> Vercel (Frontend) -> Railway (Backend API) -> MongoDB Atlas / Redis Cloud`

### 2.1 Frontend Architecture (React + Vite)
- **Framework:** React 18+ with Vite for ultra-fast builds.
- **State Management:** Zustand for lightweight, scalable global state.
- **Styling:** Tailwind CSS for a modern, responsive UI.
- **Routing:** React Router v6 for clean SPA navigation.
- **API Client:** Axios with centralized interceptors for Auth and Error handling.

### 2.2 Backend Architecture (Node.js + Express)
- **Pattern:** Modular Clean Architecture (Routes -> Controllers -> Services -> Repositories).
- **Security:** Helmet, CORS, Express-Rate-Limit, and JWT-based Auth.
- **Observability:** Winston-powered structured logging with sensitive data masking.
- **API Documentation:** Swagger UI (OpenAPI 3.0) at `/api-docs`.

### 2.3 AI & Automation Layer
- **AI Engine:** Multi-provider abstraction (Gemini 2.0 Flash Lite / OpenAI).
- **Prompt Engineering:** Versioned, context-aware system instructions.
- **Workflows:** Integration ready for n8n/Make.com via secure webhooks.
- **WhatsApp:** Automated communication via WhatsApp Cloud API / Twilio.

---

## 3. Folder Structure Mapping

### /frontend
- `src/api/`: Centralized API client and services.
- `src/components/`: Reusable UI components (shadcn/ui based).
- `src/pages/`: Main application views.
- `src/hooks/`: Custom React hooks for business logic.
- `src/store/`: Zustand state definitions.

### /backend
- `modules/`: Feature-based modular logic.
- `controllers/`: Request handling and response formatting.
- `services/`: Core business logic and AI processing.
- `repositories/`: Database interaction layer.
- `middlewares/`: Security, logging, and validation filters.
- `utils/`: Helpers, AI agents, and telegram listeners.
- `database/`: Mongoose connection and schema definitions.

---

## 4. API Documentation Structure
- **Base URL:** `https://api.nhcservice.com/api/v1`
- **Auth:** Bearer Token (JWT).
- **Endpoints:**
  - `POST /auth/login`: User authentication.
  - `GET /health`: System heartbeat and dependency check.
  - `GET /orders`: AI-filtered order history.
  - `POST /ai/query`: NLP healthcare assistant endpoint.

---

## 5. Security & Compliance
- **Data Encryption:** All sensitive data is encrypted at rest and in transit (TLS 1.3).
- **Rate Limiting:** Protects against DDoS and brute force.
- **Sanitization:** Input validation via Zod/Joi.
- **Audit Logs:** Global request logger captures all administrative actions.

---

## 6. Production Deployment Strategy

### Infrastructure
- **Frontend:** Vercel (Auto-scaling, Global Edge Network).
- **Backend:** Railway (Dockerized container service).
- **Database:** MongoDB Atlas (M0/M10 Cluster).
- **Cache:** Redis Cloud (Low-latency session/data caching).

### CI/CD Pipeline (GitHub Actions)
1. **Lint & Test:** Ensure code quality on every PR.
2. **Build:** Generate production bundles.
3. **Deploy:** Automated rollout to Vercel/Railway on merge to `main`.

---

## 7. Scalability & Future Growth
- **Horizontal Scaling:** Stateless backend allows for easy container replication.
- **Background Jobs:** Ready for BullMQ / RabbitMQ for intensive AI tasks.
- **Monitoring:** Integration ready for Sentry (Errors) and New Relic (APM).

---
*Document Version: 1.0.0 | Last Updated: 2026-05-15*
