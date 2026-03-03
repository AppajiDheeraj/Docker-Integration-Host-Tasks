# Docker Containerization Guide

## Overview

Three independent Docker services:
1. **PostgreSQL** - Database (official image)
2. **Backend** - Django REST API
3. **Frontend** - React + Vite + Nginx

---

## 1. Build Images

### Backend
```bash
cd backend
docker build -t todo-backend .
```

### Frontend
```bash
cd frontend
docker build -t todo-frontend .
```

---

## 2. Run Containers Independently

### PostgreSQL
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_DB=tododb \
  -e POSTGRES_USER=todouser \
  -e POSTGRES_PASSWORD=todopass \
  -p 5432:5432 \
  postgres:15
```

### Backend
```bash
docker run -d \
  --name backend \
  --link postgres:postgres \
  -p 8000:8000 \
  -e DB_NAME=tododb \
  -e DB_USER=todouser \
  -e DB_PASSWORD=todopass \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e SECRET_KEY=your-secret-key-change-in-production \
  -e DEBUG=True \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,backend \
  todo-backend
```

### Run Migrations (First Time Only)
```bash
docker exec backend python manage.py migrate
```

### Frontend
```bash
docker run -d \
  --name frontend \
  --link backend:backend \
  -p 80:80 \
  todo-frontend
```

---

## 3. Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health/

---

## 4. Stop and Remove Containers

```bash
docker stop frontend backend postgres
docker rm frontend backend postgres
```

---

## 5. Clean Up Images

```bash
docker rmi todo-frontend todo-backend postgres:15
```

---

## Key Features

✅ **Independent Services** - Each container runs standalone
✅ **Environment Variables** - All configuration via env vars
✅ **No Hardcoded Secrets** - Secrets passed at runtime
✅ **Reproducible** - Same build every time
✅ **Clean Dockerfiles** - Minimal, readable, best practices
✅ **Multi-stage Build** - Frontend uses build + production stages
✅ **Lightweight** - Alpine-based images where possible

---

## Docker Image Sizes (Approximate)

- **Backend**: ~200MB (Python slim)
- **Frontend**: ~45MB (Nginx Alpine)
- **PostgreSQL**: ~380MB (Official image)

---

## Environment Variables Reference

### Backend
| Variable | Example | Required |
|----------|---------|----------|
| DB_NAME | tododb | Yes |
| DB_USER | todouser | Yes |
| DB_PASSWORD | todopass | Yes |
| DB_HOST | postgres | Yes |
| DB_PORT | 5432 | Yes |
| SECRET_KEY | random-secret | Yes |
| DEBUG | True | No |
| ALLOWED_HOSTS | localhost | No |

### Frontend
Built with `VITE_API_URL=/api` (configured in `.env`)

---

## Notes

- Backend uses `0.0.0.0:8000` to accept external connections
- Frontend Nginx proxies `/api` requests to backend
- PostgreSQL data is ephemeral (add volume for persistence)
- Use `--link` for simple container networking (or use Docker networks)
