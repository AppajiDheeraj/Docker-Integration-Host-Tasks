# Docker Compose Orchestration

Complete application stack with one command.

## Quick Start

```bash
docker-compose up -d
```

Access the application at **http://localhost**

## Services

### 1. **postgres**
- Image: `postgres:15`
- Database with persistent storage
- Health checks enabled
- Network: `backend-network`
- Volume: `postgres_data`

### 2. **backend**
- Django REST API
- Auto-runs migrations on startup
- Network: `backend-network`
- Depends on: `postgres`

### 3. **frontend**
- Vite React build
- Builds static files
- Network: `frontend-network`
- Volume: `frontend_build` (shared with nginx)

### 4. **nginx**
- Reverse proxy
- Serves frontend static files
- Proxies `/api` to backend
- Networks: `frontend-network`, `backend-network`
- Exposed port: `80`

## Architecture

```
┌─────────────────────────────────────────┐
│            Host (Port 80)               │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │    Nginx    │ (Reverse Proxy)
        └──┬───────┬──┘
           │       │
  ┌────────▼──┐ ┌──▼────────┐
  │ Frontend  │ │  Backend  │
  │  (Static) │ │  (Django) │
  └───────────┘ └─────┬─────┘
                      │
                ┌─────▼──────┐
                │ PostgreSQL │
                └────────────┘
```

## Networks

- **backend-network**: postgres ↔ backend ↔ nginx
- **frontend-network**: frontend ↔ nginx

Internal services communicate via Docker DNS (service names).

## Volumes

- **postgres_data**: Persistent database storage
- **frontend_build**: Shared frontend build artifacts

## Commands

### Start all services
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### Rebuild images
```bash
docker-compose build
```

### Restart a service
```bash
docker-compose restart backend
```

### Execute command in service
```bash
docker-compose exec backend python manage.py createsuperuser
```

## Environment Variables

Create `.env` file in the project root:

```env
SECRET_KEY=your-secret-key
DEBUG=True
```

## Exposed Ports

Only **port 80** is exposed to the host. All other services communicate internally via Docker networks.

## Health Checks

- **postgres**: `pg_isready` check every 10s
- **backend**: Waits for postgres to be healthy before starting

## Data Persistence

PostgreSQL data persists in the `postgres_data` named volume. Data survives container restarts but is removed with `docker-compose down -v`.

## Security Features

✅ Internal service communication via Docker networks  
✅ Only nginx exposed to host  
✅ Environment variables for secrets  
✅ No hardcoded credentials  
✅ Named volumes for data isolation  

## Troubleshooting

### View service status
```bash
docker-compose ps
```

### Check backend logs
```bash
docker-compose logs backend
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
```
