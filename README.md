# Mini ERP — Frontend

Inventory & Sales Management System web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## Project Setup & Installation Guide

### Project Overview

```
Tanvir Assaingment/
├── Server/          # Backend API — must run first
└── Client/          # This frontend app
    ├── src/
    │   ├── api/         # API service layer
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Auth context
    │   ├── pages/       # Route pages
    │   └── types/       # TypeScript types
    ├── .env.example
    └── package.json
```

### Prerequisites

| Tool    | Version | Notes                                |
| ------- | ------- | ------------------------------------ |
| Node.js | v18+    | [nodejs.org](https://nodejs.org)     |
| npm     | v9+     | Included with Node.js                |
| Backend | Running | See [Server README](../Server/README.md) |

### Full Setup (first time)

#### Step 1 — Backend setup

```bash
cd Server
npm install
Copy-Item .env.example .env    # Windows PowerShell
# cp .env.example .env         # Linux / macOS
npm run seed
npm run dev
```

Backend should be running at `http://localhost:5000`.

#### Step 2 — Frontend setup

Open a **new terminal**:

```bash
cd Client
npm install
Copy-Item .env.example .env    # Windows PowerShell
# cp .env.example .env         # Linux / macOS
npm run dev
```

Open `http://localhost:5173` in your browser.

### Environment variables

Edit `Client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

| Variable       | Description           | Default                   |
| -------------- | --------------------- | ------------------------- |
| `VITE_API_URL` | Backend API base URL  | `http://localhost:5000`   |

> In development, Vite proxies `/api` and `/uploads` to the backend automatically (see `vite.config.ts`). You do not need to change anything if both run on default ports.

### Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server on port 5173   |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

### Production build (optional)

```bash
npm run build
npm run preview
```

Set `VITE_API_URL` to your deployed backend URL before building.

### Troubleshooting

| Issue | Solution |
| ----- | -------- |
| Login fails / network error | Ensure backend is running on port 5000 |
| Blank page after login | Check browser console; verify `npm run seed` was run |
| Product images not loading | Backend must be running; images served from `/uploads` |
| 401 redirect loop | Clear `localStorage` and log in again |

---

## Admin Login Credentials

Use these on the login page after seeding the backend (`npm run seed` in `Server` folder).

| Role     | Email               | Password      |
| -------- | ------------------- | ------------- |
| Admin    | `admin@erp.com`     | `admin123`    |
| Manager  | `manager@erp.com`   | `manager123`  |
| Employee | `employee@erp.com`  | `employee123` |

### What each role can do in the app

| Feature                     | Admin | Manager | Employee |
| --------------------------- | :---: | :-----: | :------: |
| Dashboard                   | ✅    | ✅      | ✅       |
| View products               | ✅    | ✅      | ✅       |
| Create / edit / delete products | ✅ | ✅   | ❌       |
| View sales                  | ✅    | ✅      | ✅       |
| Create sales                | ✅    | ✅      | ✅       |
| Manage users (create / edit role / delete) | ✅ | ❌ | ❌ |

> Only **admin** can access the **Users** page. Password is set only when creating a user — not editable later.

---

## Application Routes

| Route           | Page         | Required Permission |
| --------------- | ------------ | ------------------- |
| `/login`        | Login        | — (public)          |
| `/`             | Dashboard    | Authenticated       |
| `/products`     | Products     | `products:read`     |
| `/sales`        | Sales list   | `sales:read`        |
| `/sales/create` | Create sale  | `sales:create`      |
| `/users`        | User management | `users:read` (admin only) |

---

## Tech Stack

- **React 19** with React Router v7
- **TanStack Query** for server state
- **Axios** for API requests (JWT via `Authorization` header)
- **Tailwind CSS 4** for styling
- **Sonner** for toast notifications
- **Lucide React** for icons
