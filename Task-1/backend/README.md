# To-Do API Backend

Django REST Framework API for managing to-do items with PostgreSQL.

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

3. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Start server:**
```bash
python manage.py runserver
```

## API Endpoints

### Health Check
- **GET** `/api/health/`
  - Returns service and database connectivity status

```bash
curl http://localhost:8000/api/health/
```

### To-Do Operations

- **GET** `/api/todos/`
  - Fetch all to-dos
  - Response: `[{id, content, status, created_at, updated_at}, ...]`

```bash
curl http://localhost:8000/api/todos/
```

- **POST** `/api/todos/`
  - Create a new to-do
  - Body: `{content: string, status?: "pending"|"completed"}`
  - Response: `{id, content, status, created_at, updated_at}`

```bash
# Linux/Mac
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"content":"Test task","status":"pending"}'

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:8000/api/todos/ -Method POST -ContentType "application/json" -Body '{"content":"Test task","status":"pending"}'
```

- **GET** `/api/todos/{id}/`
  - Fetch a specific to-do
  - Response: `{id, content, status, created_at, updated_at}`

```bash
curl http://localhost:8000/api/todos/1/
```

- **PUT** `/api/todos/{id}/`
  - Update a to-do (full update)
  - Body: `{content: string, status: "pending"|"completed"}`

```bash
# Linux/Mac
curl -X PUT http://localhost:8000/api/todos/1/ \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated task","status":"completed"}'

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:8000/api/todos/1/ -Method PUT -ContentType "application/json" -Body '{"content":"Updated task","status":"completed"}'
```

- **PATCH** `/api/todos/{id}/`
  - Partial update a to-do
  - Body: `{content?: string, status?: "pending"|"completed"}`

```bash
# Linux/Mac
curl -X PATCH http://localhost:8000/api/todos/1/ \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:8000/api/todos/1/ -Method PATCH -ContentType "application/json" -Body '{"status":"completed"}'
```

- **DELETE** `/api/todos/{id}/`
  - Delete a to-do
  - Response: `204 No Content`

```bash
# Linux/Mac
curl -X DELETE http://localhost:8000/api/todos/1/

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:8000/api/todos/1/ -Method DELETE
```

## Database Schema

**Todo Model:**
- `id` (Primary Key, Auto-increment)
- `content` (Text)
- `status` (String: "pending" or "completed", default: "pending")
- `created_at` (DateTime, auto-generated)
- `updated_at` (DateTime, auto-updated)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_NAME | PostgreSQL database name | tododb |
| DB_USER | PostgreSQL username | todouser |
| DB_PASSWORD | PostgreSQL password | todopass |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| SECRET_KEY | Django secret key | - |
| DEBUG | Debug mode | False |
| ALLOWED_HOSTS | Comma-separated hosts | - |
