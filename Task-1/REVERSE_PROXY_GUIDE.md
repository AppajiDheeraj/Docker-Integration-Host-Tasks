# Reverse Proxy & Routing Architecture

## Single Entry Point

**Public Access:** `http://localhost` (Port 80)

All traffic flows through Nginx reverse proxy. Backend and database are NOT directly accessible from the host.

---

## Routing Rules

### 1. Frontend Routes (`/`)
```
User → http://localhost/
     ↓
   Nginx serves static files from /usr/share/nginx/html
     ↓
   React app loads in browser
```

**Handled by:**
- `location /` block in nginx.conf
- Serves built React application
- Client-side routing with `try_files`

### 2. API Routes (`/api/*`)
```
User → http://localhost/api/todos/
     ↓
   Nginx proxies to backend:8000/api/todos/
     ↓
   Django REST API processes request
     ↓
   Response flows back through Nginx
```

**Handled by:**
- `location /api/` block in nginx.conf
- Proxies to `backend:8000` (internal Docker network)
- Adds proxy headers for proper request handling

### 3. Health Check (`/health`)
```
User → http://localhost/health
     ↓
   Nginx responds directly with "healthy"
```

**Handled by:**
- `location /health` block in nginx.conf
- No backend involvement
- Quick health status check

---

## Network Architecture

```
┌─────────────────────────────────────────────┐
│              PUBLIC INTERNET                │
│         (User's Browser/Client)             │
└──────────────────┬──────────────────────────┘
                   │
                   │ Port 80 (ONLY exposed port)
                   │
         ┌─────────▼─────────┐
         │   Nginx (Proxy)   │
         │  Single Entry     │
         │     Point         │
         └────┬──────────┬───┘
              │          │
    ┌─────────▼──┐   ┌───▼──────────┐
    │  Frontend  │   │   Backend    │
    │  (Static)  │   │   (Django)   │
    │            │   │   Port 8000  │
    │ NOT EXPOSED│   │ NOT EXPOSED  │
    └────────────┘   └──────┬───────┘
                            │
                     ┌──────▼────────┐
                     │  PostgreSQL   │
                     │   Port 5432   │
                     │  NOT EXPOSED  │
                     └───────────────┘
```

---

## Service Isolation

### ✅ Publicly Accessible
- **Nginx** (Port 80) - Reverse proxy only

### ❌ NOT Publicly Accessible
- **Backend** (Port 8000) - Internal only
- **PostgreSQL** (Port 5432) - Internal only
- **Frontend build** - Served by Nginx, not exposed directly

---

## Security Features

### 1. **Port Isolation**
Only port 80 is exposed to the host. Backend and database are unreachable from outside Docker networks.

### 2. **Network Segmentation**
- `backend-network`: postgres ↔ backend ↔ nginx
- `frontend-network`: frontend ↔ nginx
- Services can only communicate within their networks

### 3. **Proxy Headers**
Nginx adds security and routing headers:
- `X-Real-IP`: Original client IP
- `X-Forwarded-For`: Proxy chain
- `X-Forwarded-Proto`: Original protocol (http/https)
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-XSS-Protection`: XSS protection

### 4. **Upstream Configuration**
Backend accessed via Docker DNS name (`backend:8000`), not localhost.

---

## Testing the Setup

### 1. Frontend Access
```bash
curl http://localhost/
# Returns: React app HTML
```

### 2. API Access (via proxy)
```bash
curl http://localhost/api/health/
# Returns: Backend health status
```

### 3. Direct Backend Access (should fail)
```bash
curl http://localhost:8000/api/health/
# Returns: Connection refused (not exposed)
```

### 4. Direct Database Access (should fail)
```bash
psql -h localhost -p 5432 -U todouser
# Returns: Connection refused (not exposed)
```

---

## Nginx Configuration Highlights

### Upstream Definition
```nginx
upstream backend {
    server backend:8000;
}
```
Uses Docker service name for internal routing.

### API Proxy
```nginx
location /api/ {
    proxy_pass http://backend/api/;
    # Proxy headers...
}
```
Forwards all `/api/*` requests to backend service.

### Frontend Serving
```nginx
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```
Serves static files with SPA routing support.

---

## Benefits

✅ **Single Entry Point** - All traffic through port 80  
✅ **Service Isolation** - Backend/DB not directly accessible  
✅ **Clean URLs** - No port numbers in URLs  
✅ **Security** - Reduced attack surface  
✅ **Flexibility** - Easy to add SSL, rate limiting, etc.  
✅ **Scalability** - Can add multiple backend instances to upstream  

---

## Deployment

```bash
# Start the stack
docker-compose up -d

# Verify nginx is the only exposed service
docker-compose ps

# Test routing
curl http://localhost/          # Frontend
curl http://localhost/api/health/  # Backend via proxy
curl http://localhost/health    # Nginx health
```

Access application at: **http://localhost**
