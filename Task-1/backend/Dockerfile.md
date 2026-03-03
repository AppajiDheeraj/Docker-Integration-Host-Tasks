# Backend Dockerfile

Multi-stage Python application container.

## Build Image

```bash
docker build -t todo-backend .
```

## Run Container

```bash
docker run -d \
  --name backend \
  -p 8000:8000 \
  -e DB_NAME=tododb \
  -e DB_USER=todouser \
  -e DB_PASSWORD=todopass \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e SECRET_KEY=your-secret-key \
  -e DEBUG=True \
  -e ALLOWED_HOSTS=localhost,127.0.0.1 \
  todo-backend
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DB_NAME | PostgreSQL database name | Yes |
| DB_USER | PostgreSQL username | Yes |
| DB_PASSWORD | PostgreSQL password | Yes |
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port | Yes |
| SECRET_KEY | Django secret key | Yes |
| DEBUG | Debug mode (True/False) | No |
| ALLOWED_HOSTS | Comma-separated hosts | No |

## Notes

- Runs on port 8000
- Requires PostgreSQL database connection
- Uses environment variables for all configuration
- No hardcoded secrets
