# Frontend Dockerfile

Multi-stage build with Node.js and Nginx.

## Build Image

```bash
docker build -t todo-frontend .
```

## Run Container

```bash
docker run -d \
  --name frontend \
  -p 80:80 \
  todo-frontend
```

## Architecture

**Stage 1: Build**
- Uses Node.js 20 Alpine
- Installs dependencies
- Builds production bundle with Vite

**Stage 2: Production**
- Uses Nginx Alpine
- Serves static files
- Proxies API requests to backend

## Nginx Configuration

The included `nginx.conf`:
- Serves React app on port 80
- Handles client-side routing
- Proxies `/api` requests to backend service

## Notes

- Final image is lightweight (Nginx Alpine)
- No Node.js in production image
- API URL configured via environment variable at build time
- Proxies backend requests through Nginx
