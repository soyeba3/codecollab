<div align="center">

# ⚡ CodeCollab

### Real-Time Collaborative Code Review Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br />

**Share code. Debug together. Ship faster.**

A modern, real-time collaborative code editor where developers can review, annotate, and discuss code — all in the browser. No sign-up required.

<br />

[**🚀 Live Demo**](https://codecollab-soyeb.vercel.app) · [**📝 Report Bug**](https://github.com/soyeb/codecollab/issues) · [**✨ Request Feature**](https://github.com/soyeb/codecollab/issues)

</div>

---

## 🎯 Overview

**CodeCollab** is a full-stack, real-time collaborative code review platform built for developers who want to debug, review, and discuss code together — instantly. Think of it as **Google Docs, but for code**.

Built with **Next.js 16**, **React 19**, **Socket.io**, and **Neon PostgreSQL**, this project demonstrates expertise in:

- 🔄 Real-time WebSocket communication
- 🏗️ Full-stack application architecture
- 🎨 Modern, responsive UI/UX design
- 🗃️ Database design and ORM integration
- ⚡ Performance-focused development

---

## ✨ Key Features

### 🖥️ Live Code Editor

- **Monaco Editor** — the same editor that powers VS Code
- Syntax highlighting for JavaScript, TypeScript, Python, and more
- Real-time code synchronization across all connected users
- Intelligent cursor tracking with multi-user presence

### 👥 Real-Time Collaboration

- **WebSocket-powered** instant synchronization via Socket.io
- Live cursor positions visible for all participants
- User presence indicators with avatars and colors
- Automatic room management with join/leave events

### 💬 Live Chat

- Real-time messaging within sessions
- Message history persisted during the session
- User avatars and names displayed alongside messages
- Seamless integration within the editor workspace

### 📝 Code Annotations

- Add line-specific annotations/comments on code
- Collaborative review workflow — annotate, discuss, resolve
- Visual indicators on annotated lines
- Per-user annotation tracking

### 🔗 Instant Sharing

- One-click session creation — no sign-up required
- Beautiful share modal with copy-to-clipboard
- Unique session URLs for easy collaboration
- Sessions persist in database for future reference

### 💾 Persistent Sessions

- Sessions saved to **Neon PostgreSQL** via Drizzle ORM
- Save progress with one click
- Resume sessions anytime via unique URL
- Automatic session state management

---

## 🛠️ Tech Stack

| Layer          | Technology                  | Purpose                            |
| -------------- | --------------------------- | ---------------------------------- |
| **Frontend**   | Next.js 16 (App Router)     | Server components, routing, SSR    |
| **UI**         | React 19 + Tailwind CSS 4   | Component architecture, styling    |
| **Editor**     | Monaco Editor               | Code editing with IntelliSense     |
| **Real-Time**  | Socket.io (Client + Server) | WebSocket communication            |
| **Database**   | Neon PostgreSQL             | Serverless Postgres                |
| **ORM**        | Drizzle ORM                 | Type-safe database queries         |
| **Language**   | TypeScript 5                | End-to-end type safety             |
| **Compiler**   | React Compiler              | Automatic performance optimization |
| **Deployment** | Vercel + Render             | Frontend + WebSocket server        |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│   │ Monaco Editor │  │  Chat Panel  │  │  Annotations Panel   │  │
│   │              │  │              │  │                      │  │
│   │ Code Sync    │  │ Messages     │  │ Line Comments        │  │
│   │ Cursors      │  │ Real-time    │  │ Review Flow          │  │
│   └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│          │                 │                     │               │
│          └─────────────────┼─────────────────────┘               │
│                            │                                     │
│                   Socket.io Client                               │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │ WebSocket
                             ▼
┌────────────────────────────┼─────────────────────────────────────┐
│                     SERVER (Node.js)                              │
│                            │                                     │
│                   Socket.io Server                               │
│                            │                                     │
│          ┌─────────────────┼─────────────────────┐               │
│          │                 │                     │               │
│   ┌──────▼───────┐  ┌─────▼──────┐  ┌──────────▼───────────┐   │
│   │ Room Manager │  │   Event    │  │   State Manager      │   │
│   │              │  │  Handlers  │  │                      │   │
│   │ Join/Leave   │  │ Code Sync  │  │ Users, Code,         │   │
│   │ Presence     │  │ Chat       │  │ Annotations, Chat    │   │
│   └──────────────┘  │ Cursor     │  └──────────────────────┘   │
│                     │ Annotations│                               │
│                     └────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                             │
│                                                                  │
│   POST /api/session          →  Create new session               │
│   GET  /api/session/:id      →  Fetch session data               │
│   PATCH /api/session/:id     →  Save session code                │
│                                                                  │
│                     Drizzle ORM                                  │
│                         │                                        │
│                         ▼                                        │
│                 ┌───────────────┐                                │
│                 │ Neon Postgres │                                │
│                 │  (Serverless) │                                │
│                 └───────────────┘                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
codecollab/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page (session creation)
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── api/
│   │   │   └── session/              # REST API routes
│   │   │       ├── route.ts          # POST - Create session
│   │   │       └── [sessionId]/
│   │   │           └── route.ts      # GET/PATCH - Session CRUD
│   │   └── review/
│   │       └── [sessionId]/
│   │           ├── page.tsx          # Server component (data fetching)
│   │           └── editor-page-client.tsx  # Client component (editor UI)
│   │
│   ├── components/                   # React Components
│   │   ├── code-editor.tsx           # Monaco Editor wrapper
│   │   ├── chat-panel.tsx            # Real-time chat
│   │   ├── annotations-panel.tsx     # Code annotations
│   │   ├── session-header.tsx        # Header with save/share
│   │   ├── share-modal.tsx           # Share session modal
│   │   ├── room.tsx                  # Room provider wrapper
│   │   └── user-avatar.tsx           # User avatar component
│   │
│   ├── server/                       # Backend
│   │   ├── index.ts                  # HTTP server + Next.js + Socket.io
│   │   ├── standalone.ts             # Standalone Socket.io server
│   │   ├── socket.ts                 # Socket.io event handlers
│   │   └── types.ts                  # Shared TypeScript types
│   │
│   ├── lib/
│   │   └── liveblocks.config.tsx     # Socket.io adapter (context + hooks)
│   │
│   ├── db/
│   │   ├── index.ts                  # Database connection
│   │   └── schema.ts                 # Drizzle schema
│   │
│   └── types/
│       └── index.ts                  # Shared types
│
├── next.config.ts                    # Next.js configuration
├── drizzle.config.ts                 # Drizzle ORM configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- **PostgreSQL** database (or [Neon](https://neon.tech) free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/soyeb/codecollab.git
cd codecollab
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Socket.io (production only — leave commented for local dev)
# NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.onrender.com
```

### 4. Set Up Database

```bash
npx drizzle-kit push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — both Next.js and Socket.io run on the same port in development.

---

## 🌐 Deployment

### Frontend → Vercel

```bash
# Push to GitHub, connect repo in Vercel dashboard
# Add environment variables:
#   DATABASE_URL
#   NEXT_PUBLIC_SOCKET_URL
```

### Socket.io Server → Render (Free Tier)

| Setting           | Value                                        |
| ----------------- | -------------------------------------------- |
| **Build Command** | `npm install`                                |
| **Start Command** | `npm run socket-server`                      |
| **Environment**   | `ALLOWED_ORIGIN=https://your-app.vercel.app` |

> See [`RENDER_DEPLOYMENT_BANGLA.md`](./RENDER_DEPLOYMENT_BANGLA.md) for detailed deployment instructions.

---

## 🔌 WebSocket Events

### Client → Server

| Event               | Payload                          | Description               |
| ------------------- | -------------------------------- | ------------------------- |
| `join-room`         | `roomId, userInfo, initialCode?` | Join a collaboration room |
| `code-change`       | `code: string`                   | Broadcast code changes    |
| `cursor-move`       | `{ line, column }`               | Update cursor position    |
| `chat-message`      | `text: string`                   | Send chat message         |
| `annotation-add`    | `{ line, text }`                 | Add code annotation       |
| `annotation-delete` | `annotationId: string`           | Remove annotation         |

### Server → Client

| Event                | Payload          | Description             |
| -------------------- | ---------------- | ----------------------- |
| `room-state`         | `RoomState`      | Full room state on join |
| `code-update`        | `code: string`   | Synced code changes     |
| `cursor-update`      | `userId, cursor` | Other user's cursor     |
| `user-joined`        | `User`           | New user notification   |
| `user-left`          | `userId: string` | User disconnect         |
| `chat-received`      | `ChatMessage`    | New chat message        |
| `annotation-added`   | `Annotation`     | New annotation          |
| `annotation-deleted` | `annotationId`   | Removed annotation      |

---

## 🎨 Design Philosophy

- **Dark Mode First** — Premium dark UI with purple accent gradients
- **Glassmorphism** — Frosted glass effects with `backdrop-blur`
- **Micro-Animations** — Smooth transitions and hover effects
- **Responsive** — Mobile-first with adaptive layouts
- **Accessibility** — Keyboard navigation, ARIA labels, focus states

---

## 📊 Performance

- ⚡ **React Compiler** — Automatic memoization (zero manual `useMemo`/`useCallback`)
- 🔄 **WebSocket** — Sub-50ms real-time synchronization
- 🗃️ **Serverless DB** — Neon auto-scales with demand
- 📦 **Turbopack** — Lightning-fast HMR in development
- 🖼️ **Next.js Image** — Optimized avatar loading

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Soyeb](https://github.com/soyeb)**

⭐ Star this repo if you found it helpful!

</div>
