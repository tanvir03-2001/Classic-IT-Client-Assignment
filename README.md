# Mini ERP — Frontend

Inventory & Sales Management System web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## Live URL

| App | URL |
| --- | --- |
| Frontend | `https://mini-erp-client-ebon.vercel.app` |
| Backend API | `https://mini-erp-api-zeta.vercel.app` |

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
    │   ├── lib/         # Utilities (image validation, formatting)
    │   ├── pages/       # Route pages
    │   └── types/       # TypeScript types
    ├── .env.example
    ├── vercel.json
    └── package.json
```

### Prerequisites

| Tool       | Version | Notes                                |
| ---------- | ------- | ------------------------------------ |
| Node.js    | v18+    | [nodejs.org](https://nodejs.org)     |
| npm        | v9+     | Included with Node.js                |
| Backend    | Running | See [Server README](../Server/README.md) |
| Cloudinary | —       | Configured on backend for product images |

### Full Setup (first time)

#### Step 1 — Backend setup

```bash
cd Server
npm install
Copy-Item .env.example .env    # Windows PowerShell
# cp .env.example .env         # Linux / macOS
```

Edit `Server/.env` — set `MONGODB_URI`, `JWT_SECRET`, and **Cloudinary** credentials (see Server README).

```bash
npm run dev
```

Default users (admin, manager, employee) are created automatically on first database connection.

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

> In development, Vite proxies `/api` to the backend automatically (see `vite.config.ts`). Product images are loaded directly from **Cloudinary URLs** returned by the API.

### Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server on port 5173   |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

### Production build & deploy

```bash
npm run build
npm run preview
```

**Vercel deployment:**

1. Set `VITE_API_URL` to your deployed backend URL before building
2. Push to GitHub and import in Vercel
3. Framework preset: **Vite**
4. Output directory: `dist`

Example production `.env`:

```env
VITE_API_URL=https://mini-erp-api-zeta.vercel.app
```

### Troubleshooting

| Issue | Solution |
| ----- | -------- |
| Login fails / network error | Ensure backend is running on port 5000 |
| Blank page after login | Check browser console; ensure backend is running and default users were created |
| Sales page blank | Hard refresh; ensure API returns valid sales data |
| Product images not loading | Images come from Cloudinary URLs in API response — check `image` field |
| Image upload rejected | Use JPG, PNG, GIF, WebP, BMP, or TIFF under 5 MB |
| `Unsupported image format` | AVIF/HEIC not supported — convert to JPG or PNG |
| 401 redirect loop | Clear `localStorage` and log in again |

---

## Admin Login Credentials

Use these on the login page after starting the backend (`npm run dev` in `Server` folder). Default users are created automatically if they do not exist.

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

## Features

### Product management

- Search, paginate, create, edit, and delete products
- **Image upload** via backend to Cloudinary
- Allowed formats: **JPG, PNG, GIF, WebP, BMP, TIFF** (max **5 MB**)
- Client-side validation before upload with clear error messages
- **Auto unique SKU** — if SKU already exists, backend generates `SKU-2`, `SKU-3`, etc.

### Sales

- Cart-style sale creation with product search
- Stock validation on client and server
- Sales history with line items and creator name

### Dashboard

- Total products, sales count, revenue
- Low-stock products (stock < 5)

---

## Tech Stack

- **React 19** with React Router v7
- **TanStack Query** for server state
- **Axios** for API requests (JWT via `Authorization` header)
- **Tailwind CSS 4** for styling
- **Sonner** for toast notifications
- **Lucide React** for icons

---

## Related Docs

- [Server README](../Server/README.md) — API setup, Cloudinary config, full API docs
- [Project Overview](../PROJECT_OVERVIEW.md) — architecture & interview prep
- [Interview Questions](../INTERVIEW_QUESTIONS.md) — Q&A guide
