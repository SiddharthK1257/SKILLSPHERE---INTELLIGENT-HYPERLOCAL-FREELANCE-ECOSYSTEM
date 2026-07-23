# 🌐 SkillSphere

> **Next-Generation AI-Powered Freelance Marketplace & Secure Escrow Platform**

SkillSphere is a full-stack, enterprise-grade freelance marketplace platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It seamlessly connects clients and freelancers through intelligent AI skill matching, real-time messaging, secure milestone-based Razorpay escrow payments, comprehensive review analytics, and a powerful administrative dashboard.

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation & Execution](#installation--execution)
- [API Reference](#-api-reference)
- [Core Modules](#-core-modules)
  - [AI Matching & Recommendation Engine](#1-ai-matching--recommendation-engine)
  - [Escrow Payment & Wallet Infrastructure](#2-escrow-payment--wallet-infrastructure)
  - [Reputation & Review Analytics System](#3-reputation--review-analytics-system)
  - [Real-time Socket.IO Chat & Notifications](#4-real-time-socketio-chat--notifications)
- [Security & Authentication](#-security--authentication)
- [License](#-license)

---

## ✨ Key Features

### 👥 Multi-Role User Management
- **Client & Freelancer Roles**: Seamless role switching, comprehensive profiles, work experience, portfolios, certifications, and availability management.
- **Authentication**: Native JWT auth, Google OAuth 2.0 integration, email verification with Nodemailer, and Two-Factor Authentication (2FA) support.

### 💼 Marketplace & Gig Management
- **Gig Creation & Discovery**: Rich multi-package (Basic, Standard, Premium) gig creation with category filtering, search tags, extra services, custom buyer requirements, and FAQs.
- **Proposal Lifecycle**: Proposal submission, milestone planning, proposal status tracking, client approval/rejection workflows, and customized project terms.

### 🛡️ Secure Escrow & Razorpay Payment System
- **Escrow Contracts**: Client funds are safely held in escrow and released upon milestone completion or work approval.
- **Razorpay Integration**: Native order creation, signature verification, webhook processing, wallet tracking, transaction histories, and withdrawal request workflows.

### 🧠 AI-Powered Matching & Recommendations
- **Semantic Vector & Cosine Similarity Matching**: Matches job requirements and freelancer skill sets using TF-IDF / vector embeddings and HuggingFace API integration.
- **Spearman Rank Correlation & Fraud Detection**: Detects suspicious bidding patterns, review manipulation, duplicate content, and irregular transaction activity.

### 💬 Real-Time Communication
- **Socket.IO Chat**: Instant messaging, unread counts, online/offline status, attachment support, and active conversation tracking.
- **Real-Time Notifications**: Instant push-style web notifications for proposal status changes, payment releases, message updates, and security alerts.

### 📊 Advanced Reputation & Review Analytics
- **Multi-Factor Reputation Score**: Dynamically calculated based on completion rate, average rating, volume of orders, dispute record, and sentiment analysis of review feedback.
- **Detailed Analytics Dashboard**: Revenue tracking, impression/click charts, conversion metrics, and rating distributions.

### 🛠️ Administrative Control Center
- **User & Content Moderation**: Admin dashboard for user suspension/activation, gig approval/rejection, report investigation, payment dispute management, and platform analytics.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client Tier
        UI[React 18 + Vite SPA]
        Router[React Router v7]
        State[Context API & Axios Interceptors]
    end

    subgraph API Tier
        Server[Express.js HTTP & Socket.IO Server]
        Auth[JWT & Passport Google OAuth]
        WS[Socket.IO Real-time Engine]
    end

    subgraph Service Tier
        AI[AI Matcher & Fraud Detector]
        Rep[Reputation & Review Engine]
        Pay[Razorpay Escrow & Wallet Manager]
    end

    subgraph Storage Tier
        DB[(MongoDB Database)]
        Cloud[Cloudinary / Local Uploads]
    end

    UI --> Router --> State
    State <-->|HTTP REST API| Server
    State <-->|WebSockets| WS
    Server --> Auth
    Server --> Service Tier
    AI --> DB
    Rep --> DB
    Pay --> DB
    Server --> Cloud
    Server --> DB
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS, Vanilla CSS design tokens & animations
- **State & Context**: React Context API (`AuthContext`, `NotificationContext`, `ThemeContext`)
- **HTTP Client**: Axios with request/response error handling interceptors
- **Icons & UI**: `react-icons`, `react-hot-toast`, Google OAuth SDK (`@react-oauth/google`)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Real-Time Engine**: Socket.IO 4
- **Security & Auth**: JSON Web Tokens (jsonwebtoken), bcryptjs, Passport.js Google OAuth 2.0, Speakeasy / otplib (2FA)
- **Payments**: Razorpay Node SDK, Crypto signature verification
- **Utilities & AI**: Cosine similarity algorithms, HuggingFace Inference API, Nodemailer, Multer + Cloudinary storage

---

## 📁 Project Directory Structure

```
SKILLSPHERE/
├── backend/
│   ├── config/             # DB connection, Passport Google OAuth, Razorpay configuration
│   ├── controllers/        # Request handlers for Auth, Admin, Gigs, Proposals, Payments, Reviews, AI, etc.
│   ├── middleware/         # Auth, Admin, Role-based access control, Payment verification, Uploads
│   ├── models/             # Mongoose Schemas (User, Gig, Proposal, Payment, Escrow, Wallet, Review, etc.)
│   ├── routes/             # Express API routes definition
│   ├── services/           # External service integration (Razorpay API service)
│   ├── socket/             # Socket.IO connection manager & real-time event handlers
│   ├── utils/              # AI Matcher, Fraud Detector, Reputation & Review Analytics, Email helper
│   ├── uploads/            # Static file storage directory
│   ├── .env                # Backend environment configuration
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── public/             # Public static assets & favicon
│   ├── src/
│   │   ├── api/            # API endpoints wrapper functions
│   │   ├── components/     # Reusable UI components (Navbar, Footer, GigCard, Reviews, Admin, Search)
│   │   ├── context/        # React Context providers (Auth, Notification, Theme, Socket)
│   │   ├── hooks/          # Custom React hooks (useSocket)
│   │   ├── pages/          # Application views (Home, BrowseGigs, Dashboard, Checkout, Chat, Admin, etc.)
│   │   ├── routes/         # App routing configuration
│   │   ├── services/       # Frontend service layers (socket, api, payment, chat, review, proposal)
│   │   ├── App.jsx         # Main App component & route map
│   │   ├── main.jsx        # Application bootstrap & top-level providers
│   │   └── index.css       # Tailwind CSS & global styles
│   ├── .env                # Frontend environment configuration
│   ├── vite.config.js      # Vite build configuration
│   └── package.json        # Frontend dependencies & scripts
│
├── .gitignore              # Root Git ignore rule set
├── package.json            # Root workspace configuration
└── README.md               # Complete project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Active local instance or MongoDB Atlas cluster URI
- **Razorpay Account**: For API Keys (`KEY_ID` & `KEY_SECRET`)

---

### Environment Configuration

#### 1. Backend Environment (`backend/.env`)
Create or configure the `backend/.env` file with the following keys:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillsphere
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay Integration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary Storage (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# HuggingFace API (Optional for Advanced AI)
HUGGINGFACE_API_KEY=your_huggingface_token
```

#### 2. Frontend Environment (`frontend/.env`)
Create or configure the `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

### Installation & Execution

#### Step 1: Install Backend Dependencies & Start Server
```bash
cd backend
npm install
npm run dev
```
*The backend server will start at `http://localhost:5000`.*

#### Step 2: Install Frontend Dependencies & Start Client
```bash
cd frontend
npm install
npm run dev
```
*The React application will be available at `http://localhost:5173`.*

---

## 📡 API Reference Summary

| Endpoint Category | Base Route | Description |
| :--- | :--- | :--- |
| **Authentication** | `/api/auth` | User registration, login, email verification, Google OAuth, password resets |
| **Users & Profiles** | `/api/users` | Profile retrieval, updates, portfolio management, role changing |
| **Gigs & Search** | `/api/gigs`, `/api/search` | Gig CRUD operations, category browsing, tag search, filtering |
| **Proposals** | `/api/proposals` | Proposal submission, client acceptance, milestone milestone management |
| **Payments & Escrow**| `/api/payments` | Razorpay order creation, payment verification, escrow release, wallet withdrawals |
| **Reviews & Feedback**| `/api/reviews` | Review creation, ratings distribution, helpful votes, abuse reporting |
| **Real-time Chat** | `/api/chat` | Conversation threads, message histories, file attachments |
| **AI Engine** | `/api/ai`, `/api/match` | AI recommendations, skill matching scores, job suggestions |
| **Notifications** | `/api/notifications` | Unread notifications list, read status toggling, preferences |
| **2FA Security** | `/api/2fa` | Two-factor authentication setup, OTP generation, verification |
| **Admin Control** | `/api/admin` | Platform analytics, user bans, gig moderation, dispute resolution |

---

## 🧩 Core Modules

### 1. AI Matching & Recommendation Engine
Located in `backend/utils/aiMatcher.js`, this module evaluates freelancer profiles against gig requirements.
- **Skill Alignment**: Calculates token overlap and weighted scores for required vs. optional skills.
- **Cosine Similarity**: Vectorizes profile descriptions and job specifications to measure semantic similarity.
- **Smart Ranking**: Computes an aggregate AI match score (0-100%) to recommend top candidates to clients.

### 2. Escrow Payment & Wallet Infrastructure
Located in `backend/models/Escrow.js`, `Payment.js`, `Wallet.js`, and `services/razorpayService.js`:
- **Triple-Stage Security**: Payment Order Created $\rightarrow$ Client Funds Held in Escrow $\rightarrow$ Escrow Released to Freelancer Wallet upon Work Approval.
- **Signature Integrity**: Cryptographic HMAC-SHA256 verification of Razorpay payment signatures prevents tampering.

### 3. Reputation & Review Analytics System
Located in `backend/utils/reputationCalculator.js` & `reviewAnalytics.js`:
- **Dynamic Score**: Incorporates 5-star rating breakdowns, order fulfillment speed, dispute frequency, and sentiment analysis.
- **Fraud Guard**: Evaluates submission patterns to flag suspicious review inflation or spam accounts.

### 4. Real-time Socket.IO Chat & Notifications
Located in `backend/socket/socket.js` and `frontend/src/context/SocketContext.jsx`:
- Handshakes with authenticated user tokens.
- Emits real-time events for message delivery, user typing indicators, online state updates, and push notifications.

---

## 🔒 Security & Authentication

- **JWT Storage & Protection**: Secure HTTP authentication headers with token expiry management and automated logout handling via Axios interceptors.
- **Input Sanitization & Schema Validation**: Express request body validation and Mongoose schema constraints to guard against injection.
- **Role-Based Access Control (RBAC)**: Fine-grained middleware authorization enforcing `clientOnly`, `freelancerOnly`, and `adminOnly` access rules across endpoints and UI routes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
