# D.A.M.S. — Data Acquisition & Monitoring System

A full-stack **Next.js** web application for managing IoT laboratory experiments with real-time data streaming, AI-powered analysis, and role-based access control. Built for the **ISTC Smart Lab**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Development Server](#running-the-development-server)
  - [Production Deployment](#production-deployment)
- [Architecture](#architecture)
  - [Authentication & Authorization](#authentication--authorization)
  - [Real-Time Data Pipeline](#real-time-data-pipeline)
  - [AI Integration](#ai-integration)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
  - [Authentication APIs](#authentication-apis)
  - [Experiment APIs](#experiment-apis)
  - [AI APIs](#ai-apis)
  - [Data Streaming APIs](#data-streaming-apis)
- [Pages & UI](#pages--ui)
- [WebSocket Protocol](#websocket-protocol)
- [Default Credentials](#default-credentials)
- [License](#license)

---

## Overview

D.A.M.S. is a research laboratory interface designed to:

- **Register & manage** IoT experiments with hardware components and metric definitions.
- **Stream live telemetry** data from connected devices via WebSocket/MQTT, visualized through multiple chart types (line, gauge, dial, bar, area, scatter).
- **Control devices** remotely by sending commands over a dedicated WebSocket control channel.
- **Leverage AI** (Google Gemini) for experiment insights, interactive chat, code generation, and automated lab report generation from CSV data uploads.
- **Manage users** with admin-only provisioning, bulk import from spreadsheets, and password management.

---

## Features

| Category | Capabilities |
|---|---|
| **Experiment Management** | Create, list, view, delete experiments; public/private visibility; search & filter |
| **Real-Time Streaming** | WebSocket-based live data ingestion; passkey-authenticated sessions; device filtering |
| **Visualization** | 6 chart types via ECharts (Line, Gauge, Dial, Bar, Area, Scatter); per-metric stats (min, max, avg, count) |
| **Device Control** | Start/stop commands; custom command input; reusable custom control buttons (persisted in localStorage) |
| **AI Assistant** | Context-aware chat powered by Gemini 1.5 Flash; auto-generates code with Wi-Fi + MQTT boilerplate |
| **AI Insights** | One-click experiment summary generation via Gemini |
| **AI Report** | Upload CSV data → generate a comprehensive 2-3 page lab report → download as PDF |
| **ML Prediction** | Client-side predictive model interface |
| **Authentication** | JWT (HS256) session tokens via `jose`; bcrypt password hashing; httpOnly secure cookies |
| **Authorization** | Middleware-protected routes; admin-only endpoints; private experiment access control |
| **User Management** | Admin panel with single user creation, bulk import (.xlsx/.csv), and password reset |
| **CSV Export** | Download streamed telemetry data as CSV files |
| **Responsive UI** | Tailwind CSS; Framer Motion animations; glassmorphism & gradient design; Inter font |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | MySQL (via `mysql2/promise` connection pool) |
| **Authentication** | JWT with [jose](https://github.com/panva/jose), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **AI** | [Google Gemini API](https://ai.google.dev/) (1.5 Flash + 2.5 Flash) |
| **Charts** | [ECharts](https://echarts.apache.org/) via `echarts-for-react` |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Spreadsheet Parsing** | [SheetJS (xlsx)](https://sheetjs.com/) |
| **PDF Export** | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| **Markdown Rendering** | [react-markdown](https://github.com/remarkjs/react-markdown) |
| **Process Manager** | [PM2](https://pm2.keymetrics.io/) (ecosystem config included) |
| **UUID** | [uuid](https://github.com/uuidjs/uuid) v13 |

---

## Project Structure

```
istc-smart-lab/
├── app/
│   ├── layout.tsx                  # Root layout (header, footer, auth state)
│   ├── page.tsx                    # Landing page (D.A.M.S. hero)
│   ├── globals.css                 # Global styles
│   │
│   ├── login/
│   │   └── page.tsx                # Login page
│   │
│   ├── profile/
│   │   ├── page.tsx                # User profile (server component)
│   │   └── PasswordChangeForm.tsx  # Password change form
│   │
│   ├── experiments/
│   │   ├── page.tsx                # Experiment list (sidebar layout)
│   │   ├── create/
│   │   │   └── page.tsx            # Create new experiment form
│   │   └── [id]/
│   │       ├── page.tsx            # Experiment detail page (server component)
│   │       ├── ExperimentStream.tsx # Live WebSocket telemetry stream
│   │       ├── CollapsibleSidebar.tsx
│   │       ├── AIUpload.tsx        # CSV upload → AI report generation
│   │       ├── MLPrediction.tsx    # ML prediction interface
│   │       ├── MetricStats.tsx     # Real-time statistics display
│   │       ├── MetricLineChart.tsx # Line chart visualization
│   │       ├── MetricGaugeChart.tsx
│   │       ├── MetricDialChart.tsx
│   │       ├── MetricBarChart.tsx
│   │       ├── MetricAreaChart.tsx
│   │       └── MetricScatterChart.tsx
│   │
│   ├── admin/
│   │   └── page.tsx                # Admin panel (user management)
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # POST — authenticate user
│   │   │   ├── logout/route.ts     # POST — clear session cookie
│   │   │   ├── session/route.ts    # GET  — check auth status
│   │   │   ├── signup/route.ts     # POST — create user (admin only)
│   │   │   ├── bulk-signup/route.ts# POST — bulk import users (admin only)
│   │   │   ├── change-password/route.ts  # POST — user changes own password
│   │   │   └── reset-password/route.ts   # POST — admin resets user password
│   │   │
│   │   ├── experiments/
│   │   │   ├── route.ts            # GET (list) / POST (create)
│   │   │   └── [id]/route.ts       # GET (detail) / DELETE (admin only)
│   │   │
│   │   ├── explist/route.ts        # GET — lightweight experiment list (uuid + name)
│   │   ├── ai/route.ts             # POST — AI experiment insights
│   │   ├── ai-chat/route.ts        # POST — AI conversational assistant
│   │   ├── ai-report/route.ts      # POST — AI lab report from CSV
│   │   ├── live-data/route.ts      # GET — simulated live graph data
│   │   ├── live-update/route.ts    # GET — simulated live update data
│   │   └── mqtt-data/route.ts      # POST — MQTT data ingestion endpoint
│   │
│   └── components/
│       ├── BackgroundVideo.tsx      # Background video overlay
│       └── LogoutButton.tsx         # Logout button component
│
├── components/
│   ├── AIBox.tsx                    # One-click AI insights widget
│   ├── AIChat.tsx                   # Conversational AI assistant
│   ├── LiveTime.tsx                 # Real-time clock display
│   └── ScrollToTop.tsx              # Scroll-to-top utility
│
├── lib/
│   ├── auth.ts                      # JWT encrypt/decrypt (jose)
│   └── db.ts                        # MySQL connection pool
│
├── middleware.ts                     # Route protection & authorization
├── seed.js                          # Database seeding script
├── ecosystem.config.js              # PM2 process configuration
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MySQL** server (5.7+ or 8.x)
- **Google Gemini API key** (for AI features)
- **WebSocket server** (for real-time MQTT streaming — typically Node-RED or a custom WebSocket bridge)

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_lab

# Session
SESSION_SECRET=your_very_long_random_secret_key

# AI
GEMINI_API_KEY=your_google_gemini_api_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# WebSocket (for live experiment streaming)
NEXT_PUBLIC_WS_HOST=localhost
NEXT_PUBLIC_WS_PORT=1880
NEXT_PUBLIC_WS_PATH=/mqtt-stream
NEXT_PUBLIC_WS_CONTROL_PATH=/control
```

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL server hostname |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `SESSION_SECRET` | Secret key for JWT signing (HS256). **Must be changed in production.** |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `NEXT_PUBLIC_BASE_URL` | Base URL for server-side fetch calls (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_WS_HOST` | WebSocket server hostname (e.g., Node-RED instance) |
| `NEXT_PUBLIC_WS_PORT` | WebSocket server port |
| `NEXT_PUBLIC_WS_PATH` | WebSocket endpoint path for MQTT data stream |
| `NEXT_PUBLIC_WS_CONTROL_PATH` | WebSocket endpoint path for device control commands |

---

## Getting Started

### Installation

```bash
git clone <repository-url>
cd istc-smart-lab
npm install
```

### Database Setup

1. **Create the MySQL database:**

```sql
CREATE DATABASE smart_lab;
```

2. **Run the seed script** to create tables and insert sample data:

```bash
node seed.js
```

This will:
- Drop and recreate the `experiments` and `users` tables
- Create a default admin user
- Insert 6 sample experiments

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Production Deployment

**Build and start:**

```bash
npm run build
npm start
```

**Using PM2 (recommended):**

```bash
pm2 start ecosystem.config.js
```

The PM2 configuration starts both the Next.js app (port 3000) and Node-RED (for WebSocket/MQTT bridging).

---

## Architecture

### Authentication & Authorization

```
┌──────────┐    POST /api/auth/login     ┌──────────┐
│  Client  │ ──────────────────────────► │  Server  │
│ (Browser)│                             │  (API)   │
│          │ ◄────────────────────────── │          │
│          │   Set-Cookie: session=JWT   │          │
└──────────┘                             └──────────┘
      │                                       │
      │  Subsequent requests include           │
      │  session cookie automatically          │
      ▼                                       ▼
┌──────────────────────────────────────────────────────┐
│                    middleware.ts                       │
│  • Decrypts JWT from cookie                          │
│  • Protects: /experiments/create, /profile, /admin   │
│  • Protects: non-GET /api/experiments/*               │
│  • Admin-only check for /admin routes                │
│  • Returns 401 for unauthenticated API calls         │
│  • Redirects to /login for unauthenticated pages     │
└──────────────────────────────────────────────────────┘
```

**Key details:**
- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens signed with **HS256** via `jose`; expire after **24 hours**
- Session stored in an **httpOnly** cookie with `sameSite: lax`
- Private experiments are only accessible to their creator or admins

### Real-Time Data Pipeline

```
┌──────────────┐      MQTT       ┌──────────────┐    WebSocket     ┌──────────────┐
│  IoT Device  │ ──────────────► │  Node-RED /   │ ────────────── ► │   Browser    │
│  (ESP32,     │                 │  WS Bridge    │                  │  (Next.js    │
│   RPi, etc.) │                 │               │ ◄────────────── │   Client)    │
└──────────────┘                 │  /mqtt-stream │   Control WS    │              │
                                 │  /control     │                  └──────────────┘
                                 └──────────────┘
```

**Data flow:**
1. IoT devices publish MQTT messages with `device`, `metric`, `value`, and `passkey` fields
2. Node-RED (or equivalent) bridges MQTT → WebSocket
3. The browser connects to `/mqtt-stream` for data and `/control` for sending commands
4. Messages are filtered client-side by **passkey** and **device name**
5. Each metric is displayed in its own configurable chart with real-time statistics

### AI Integration

| Endpoint | Model | Purpose |
|---|---|---|
| `/api/ai` | Gemini 1.5 Flash | One-shot experiment insights (overview, components, data, importance) |
| `/api/ai-chat` | Gemini 1.5 Flash | Multi-turn conversation with experiment context; modes: code, components, explanation, suggestions, full |
| `/api/ai-report` | Gemini 2.5 Flash | Upload CSV → generate a comprehensive 2-3 page lab report in Markdown → download as PDF |

**AI Chat features:**
- Automatically includes Wi-Fi (SSID: `istc`) and MQTT broker connection code in generated code
- Maintains a 3-message conversation history
- Deduplicates response lines to prevent repetition
- Extracts and renders clickable follow-up suggestions

---

## Database Schema

### `users` Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user ID |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| `name` | VARCHAR(255) | NOT NULL | Full name |
| `password` | VARCHAR(255) | NOT NULL | bcrypt-hashed password |
| `is_admin` | BOOLEAN | DEFAULT FALSE | Admin privilege flag |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

### `experiments` Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Internal ID |
| `uuid` | VARCHAR(255) | NOT NULL, UNIQUE | Public-facing unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Experiment name |
| `description` | TEXT | — | Experiment description |
| `components` | VARCHAR(500) | — | Comma-separated hardware components |
| `dataValues` | VARCHAR(500) | — | Comma-separated metric names (e.g., `temperature, humidity`) |
| `created_by` | INT | — | Foreign key → `users.id` |
| `is_private` | BOOLEAN | DEFAULT FALSE | Visibility flag |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

---

## API Reference

### Authentication APIs

#### `POST /api/auth/login`

Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**
| Status | Description |
|---|---|
| 200 | `{ "success": true }` + `Set-Cookie: session=<JWT>` |
| 400 | Missing email or password |
| 401 | Invalid credentials |

---

#### `POST /api/auth/logout`

Destroy the current session.

**Responses:**
| Status | Description |
|---|---|
| 200 | `{ "success": true }` + clears `session` cookie |

---

#### `GET /api/auth/session`

Check current authentication status.

**Responses:**
```json
// Authenticated
{ "authenticated": true, "user": { "userId": 1, "email": "admin@smartlab.com", "isAdmin": true } }

// Not authenticated
{ "authenticated": false }
```

---

#### `POST /api/auth/signup` _(Admin only)_

Create a new user account.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@lab.istc",
  "password": "securepass"
}
```

**Responses:**
| Status | Description |
|---|---|
| 201 | User created successfully |
| 400 | Missing required fields |
| 403 | Caller is not an admin |
| 409 | User with this email already exists |

---

#### `POST /api/auth/bulk-signup` _(Admin only)_

Import multiple users from an Excel or CSV file.

**Request:** `multipart/form-data` with a `file` field (`.xlsx`, `.xls`, or `.csv`)

**File format:** Must contain columns `name` and `email`. All imported users receive the default password `istc@12345`.

**Responses:**
| Status | Description |
|---|---|
| 201 | `{ "message": "Imported X users. Skipped Y existing or invalid entries." }` |
| 400 | No file provided or empty file |
| 403 | Caller is not an admin |

---

#### `POST /api/auth/change-password`

Authenticated user changes their own password.

**Request Body:**
```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

**Responses:**
| Status | Description |
|---|---|
| 200 | Password updated successfully |
| 400 | Missing fields or new password same as current |
| 401 | Unauthorized or incorrect current password |

---

#### `POST /api/auth/reset-password` _(Admin only)_

Reset a user's password to the default (`istc@12345`).

**Request Body:**
```json
{
  "email": "user@lab.istc"
}
```

**Responses:**
| Status | Description |
|---|---|
| 200 | Password reset to default |
| 400 | Email is required |
| 403 | Caller is not an admin |
| 404 | User not found |

---

### Experiment APIs

#### `GET /api/experiments`

List all experiments. Visibility is based on authentication state:
- **Admin:** sees all experiments
- **Logged-in user:** sees public experiments + their own private experiments
- **Anonymous:** sees only public experiments

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "uuid": "abc-123",
      "name": "Temperature Analysis",
      "description": "...",
      "components": "ESP32, DHT22",
      "dataValues": "temperature, humidity",
      "is_private": false,
      "created_by": 1,
      "created_by_name": "Admin User",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "isAdmin": false,
  "isLoggedIn": true
}
```

---

#### `POST /api/experiments` _(Authenticated)_

Create a new experiment.

**Request Body:**
```json
{
  "name": "My Experiment",
  "description": "Description of the experiment",
  "components": "Arduino, Sensor",
  "dataValues": "temperature, humidity",
  "isPrivate": false
}
```

**Responses:**
| Status | Description |
|---|---|
| 200 | `{ "success": true, "message": "Experiment created" }` |
| 401 | Unauthorized (handled by middleware) |
| 500 | Server error |

---

#### `GET /api/experiments/[id]`

Get a single experiment by UUID or name search.

**Responses:**
| Status | Description |
|---|---|
| 200 | Experiment JSON object |
| 403 | Private experiment, user not authorized |
| 404 | Experiment not found |

---

#### `DELETE /api/experiments/[id]` _(Admin only)_

Delete an experiment by UUID.

**Responses:**
| Status | Description |
|---|---|
| 200 | `{ "success": true, "message": "Experiment deleted" }` |
| 403 | Caller is not an admin |

---

#### `GET /api/explist`

Lightweight endpoint returning only `uuid` and `name` for all experiments (used for sidebar navigation).

---

### AI APIs

#### `POST /api/ai`

Generate a structured experiment overview.

**Request Body:**
```json
{
  "description": "Testing sensor latency...",
  "components": "ESP32, DHT22",
  "dataValues": "temperature, humidity"
}
```

**Response:**
```json
{ "result": "Overview:\n...\n\nComponents:\n- ...\n\nData Measured:\n- ...\n\nImportance:\n..." }
```

---

#### `POST /api/ai-chat`

Context-aware conversational AI assistant.

**Request Body:**
```json
{
  "message": "Generate code for this experiment",
  "experiment": {
    "description": "...",
    "components": "...",
    "dataValues": "..."
  },
  "history": [
    { "role": "user", "text": "previous message" }
  ]
}
```

**Modes** (auto-detected from message keywords):
| Keyword | Mode | Response Format |
|---|---|---|
| `code` | code | Code + Explanation + Suggestions |
| `component` | components | Component list |
| `explain` | explanation | Explanation + Suggestions |
| `suggest` | suggestions | Suggestion list |
| _(default)_ | full | Title + Components + Code + Explanation + Suggestions |

---

#### `POST /api/ai-report`

Generate a comprehensive lab report from uploaded CSV data.

**Request:** `multipart/form-data` with a `file` field (CSV)

**Response:**
```json
{ "report": "# Experiment Report\n\n## Abstract\n..." }
```

The report includes: Title, Abstract, Theoretical Background, Data Correlations, Detailed Readings Analysis, Graphical References, Conclusions & Recommendations.

---

### Data Streaming APIs

#### `GET /api/live-data`

Returns simulated graph data (array of random values). Used for demo/testing.

#### `GET /api/live-update`

Returns simulated live update data. Similar to `live-data`.

#### `POST /api/mqtt-data`

Receives and logs MQTT data payloads from external sources.

---

## Pages & UI

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page — animated "D.A.M.S." hero with system access button |
| `/login` | Public | Authentication form with glassmorphism design |
| `/experiments` | Public | Experiment directory with sidebar list, search, and filtering |
| `/experiments/create` | Authenticated | Form to register a new experiment |
| `/experiments/[id]` | Public/Private | Experiment detail page with live streaming, AI assistant, data analysis, and ML predictions |
| `/profile` | Authenticated | User profile with account details and password change |
| `/admin` | Admin only | Admin console: user provisioning, bulk import, password reset |

---

## WebSocket Protocol

### Data Stream (`/mqtt-stream`)

The client connects to receive experiment telemetry. Each message is a JSON object:

```json
{
  "device": "esp32-01",
  "metric": "temperature",
  "value": 24.5,
  "passkey": "ABC123xyz0",
  "timestamp": "2026-05-03T12:00:00.000Z"
}
```

**Client-side filtering:**
- Messages are filtered by `passkey` (must match the session passkey displayed in the UI)
- Optionally filtered by `device` name
- Optionally filtered by `metric` name (based on experiment's `dataValues` definition)

### Control Channel (`/control`)

Send commands to connected devices:

```json
{
  "action": "command",
  "device": "esp32-01",
  "command": "start",
  "timestamp": "2026-05-03T12:00:00.000Z"
}
```

**Built-in commands:** `start`, `stop`, plus any custom string commands.

**Custom buttons:** Users can create reusable command buttons (label + message) that persist in `localStorage`.

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@smartlab.com` | `admin123` |
| **Bulk-imported users** | _(as specified in file)_ | `istc@12345` |
| **Reset password default** | — | `istc@12345` |

> ⚠️ **Important:** Change default credentials immediately in production environments.

---

## License

This project is private and developed for the ISTC Smart Lab.
