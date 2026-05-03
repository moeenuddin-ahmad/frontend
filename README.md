# TenantHub — Multi-Tenant SaaS Frontend

> Technical assessment submission for **Fleek Bangladesh** — MERN Stack Developer Position.

A production-ready **multi-tenant SaaS** dashboard where each tenant can register, manage multiple shops, and control products per shop — all with strict data isolation.

---

## 🚀 Tech Stack

| Category          | Technology                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| **Framework**     | [React 18](https://react.dev/) via [Vite](https://vitejs.dev/)                                                |
| **Routing**       | [React Router v6](https://reactrouter.com/)                                                                   |
| **State & API**   | [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/)                                                                           |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/)                                                               |
| **Validation**    | [Zod](https://zod.dev/)                                                                                       |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/)                                                                       |
| **Icons**         | [Lucide React](https://lucide.dev/)                                                                           |
| **Styling**       | Tailwind CSS (via shadcn/ui)                                                                                  |

---

## 🏗️ Architecture & Tenant Isolation

### How Tenant Isolation Works

This system uses a **shared database with tenant-scoped access** pattern:

```
Tenants (users)
    │
    ├── owns many ──► Shops
    │                   │
    │                   └── owns many ──► Products
    │
    └── tenantId is attached to EVERY resource
```

Every `Shop` and `Product` row in the database stores a `tenantId` foreign key. The backend enforces this at every layer:

1. **Authentication Guard** — Every protected request validates the JWT and attaches the decoded `tenant` object to `req.tenant`.
2. **Shop Guard** — Before any shop operation, verifies `shop.tenantId === req.tenant.id`.
3. **Product Guard** — Before any product operation, verifies `product.tenantId === req.tenant.id` AND `product.shopId` belongs to that tenant.
4. **Service Layer** — All Prisma queries include `where: { tenantId }` to ensure a tenant can only ever read/write their own data.

**Result:** Tenant A physically cannot access, read, or modify Tenant B's shops or products — even if they know the IDs.

### Database Relationships

```
Tenant
  id        (PK)
  name
  email
  password  (bcrypt hashed)

Shop
  id        (PK)
  name
  tenantId  (FK → Tenant.id)

Product
  id        (PK)
  name
  price
  shopId    (FK → Shop.id)
  tenantId  (FK → Tenant.id)
```

> `tenantId` is stored on **both** `Shop` and `Product` for fast, single-query isolation without requiring joins.

### Scaling Approach

| Concern      | Approach                                                                |
| ------------ | ----------------------------------------------------------------------- |
| **Current**  | Shared PostgreSQL DB, tenant-scoped via `tenantId`                      |
| **Scale up** | Add DB-level Row Level Security (RLS) for zero-trust isolation          |
| **Further**  | Migrate to tenant-per-schema (Prisma multi-schema) for full isolation   |
| **API**      | Stateless JWT — horizontally scalable, no server-side sessions          |
| **Caching**  | RTK Query cache with tag-based invalidation reduces redundant API calls |

---

## 📦 Core Features

- ✅ **Tenant Registration & Login** — Name, Email, Password with JWT auth
- ✅ **Multiple Shops per Tenant** — Full CRUD with product counts
- ✅ **Product Management per Shop** — Name & Price, scoped to shop
- ✅ **Strict Data Isolation** — Tenant-scoped guards on every backend endpoint
- ✅ **Protected Routes** — Global `AuthGuard` redirects unauthenticated users
- ✅ **Server-side Pagination** — DataTable with page/limit controls
- ✅ **RTK Query Cache Invalidation** — UI auto-refreshes after mutations
- ✅ **Global Error Handler** — `handleApiError()` extracts server messages to toast
- ✅ **Toast Notifications** — Success (green) / Error (red) via Sonner

---

## 🗺️ Routes

| Path                                | Page                    | Auth        |
| ----------------------------------- | ----------------------- | ----------- |
| `/login`                            | Login                   | ❌ Public   |
| `/register`                         | Register                | ❌ Public   |
| `/`                                 | Shops List (paginated)  | ✅ Required |
| `/shop/create`                      | Create Shop             | ✅ Required |
| `/shop/:id`                         | Shop Details + Products | ✅ Required |
| `/shop/:id/edit`                    | Edit Shop               | ✅ Required |
| `/shop/:id/product/create`          | Create Product          | ✅ Required |
| `/shop/:id/product/:productId/edit` | Edit Product            | ✅ Required |
| `*`                                 | 404 Not Found           | —           |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000
```

| Variable       | Description                    | Default                 |
| -------------- | ------------------------------ | ----------------------- |
| `VITE_API_URL` | Base URL of the NestJS backend | `http://localhost:3000` |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** `>= 18`
- **npm** `>= 9`
- Backend API running — see [`/backend/README.md`](../backend/README.md)

### Installation & Run

```bash
# Enter frontend directory
cd frontend

# Install dependencies
npm install

# Copy and configure env
cp .env.example .env

# Start development server
npm run dev
```

App runs at **http://localhost:5173**

### Production Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

---

## � Project Structure

```
frontend/src/
├── components/ui/         # Reusable shadcn/ui components
├── layouts/
│   └── MainLayout.jsx     # Header (user info + logout) + footer shell
├── lib/
│   └── handleApiError.js  # Global RTK Query error → toast handler
├── pages/                 # One file per route/page
├── redux/
│   ├── api/baseApi.js     # Base RTK Query client with JWT header injection
│   └── features/          # auth / shops / products API slices
├── routes/
│   └── AuthGuard.jsx      # Redirects unauthenticated users to /login
└── tenants.auth.ts        # Shared Zod validation schemas
```

---

## 🔗 Related

- **Backend Repository:** [`/backend`](../backend/README.md) — NestJS + Prisma + PostgreSQL

---

## 📄 License

MIT — Built for the Fleek Bangladesh technical assessment.
