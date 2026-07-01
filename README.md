# OrderFlow

Sistema de delivery de pedidos. Monorepo con el **backend** (API REST) y el
**frontend** (SPA) en un único repositorio.

```
PEDIDOS/
├── backend/     API REST — Node.js + Express + MySQL   (puerto 3001)
├── frontend/    SPA — React + Vite + Tailwind           (puerto 5173)
└── README.md    (este archivo)
```

## Arquitectura

El frontend consume la API del backend vía HTTP. La URL del backend se
configura en `frontend/.env` mediante `VITE_API_URL` (por defecto
`http://localhost:3001/api`).

```
Navegador ─► frontend (Vite :5173) ─► backend (Express :3001) ─► MySQL
```

## Puesta en marcha (desarrollo)

Requisitos: **Node.js 18+** y **MySQL 8.x** (por ejemplo vía XAMPP).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # ajustar credenciales de MySQL si hace falta
mysql -u root < database/schema.sql   # crea la BD y datos de ejemplo
npm run dev                 # http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # cargar tu VITE_GOOGLE_MAPS_API_KEY
npm run dev                 # http://localhost:5173
```

Con ambos corriendo, abrí `http://localhost:5173` en el navegador.

## Documentación detallada

- **Backend** (endpoints, arquitectura, testing): [`backend/README.md`](backend/README.md) y [`backend/TESTING.md`](backend/TESTING.md)
- **Frontend**: [`frontend/README.md`](frontend/README.md)
- **Guía completa del proyecto**: [`README_COMPLETO.txt`](README_COMPLETO.txt)
