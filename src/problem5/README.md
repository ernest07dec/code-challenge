# Problem 5: ExpressJS Backend Server

## Configuration

- **Port**: Defaults to `3007`, can be overridden with `PORT` environment variable
- **Database**: SQLite database file is stored in `data/tasks.db`

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

## API Endpoints

### GET `/`

**Response: README Preview**

### GET `/health`

Returns server health status and uptime.

**Response:**

```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Tasks API

All task endpoints are prefixed with `/api/tasks`

### POST `/api/tasks`

Create a new task.

**Request Body:**

```json
{
  "name": "Task name",
  "description": "Task description (optional)"
}
```

**Response (201):**

```json
{
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "name": "Task name",
    "description": "Task description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

### GET `/api/tasks`

Get all tasks with pagination and filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `name` (optional): Filter by name (LIKE search)
- `description` (optional): Filter by description (LIKE search)
- `deletedAt` (optional):
  - `null` or not provided: Only show non-deleted tasks (default)
  - `"all"`: Show all tasks including deleted
  - Any other value: Show only deleted tasks

**Example:**

```
GET /api/tasks?page=1&limit=10&name=project&deletedAt=null
```

**Response (200):**

```json
{
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Complete project documentation",
      "description": "Write comprehensive documentation",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": null,
      "deletedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET `/api/tasks/:id`

Get a single task by ID.

**Response (200):**

```json
{
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "name": "Task name",
    "description": "Task description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
}
```

**Response (404):**

```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### PUT `/api/tasks/:id`

Update a task.

**Request Body:**

```json
{
  "name": "Updated task name",
  "description": "Updated description"
}
```

Both fields are optional - only provide the fields you want to update.

**Response (200):**

```json
{
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "name": "Updated task name",
    "description": "Updated description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z",
    "deletedAt": null
  }
}
```

### DELETE `/api/tasks/:id`

Soft delete a task (sets `deletedAt` timestamp).

**Response (200):**

```json
{
  "message": "Task deleted successfully",
  "data": {
    "id": 1,
    "name": "Task name",
    "description": "Task description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": "2024-01-01T02:00:00.000Z"
  }
}
```

## Example Usage

```bash
# Start server
npm run dev

# Create a task
curl -X POST http://localhost:3007/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "New Task", "description": "Task description"}'

# Get all tasks (paginated)
curl http://localhost:3007/api/tasks?page=1&limit=10

# Get tasks with filter
curl "http://localhost:3007/api/tasks?name=project&description=documentation"

# Get a specific task
curl http://localhost:3007/api/tasks/1

# Update a task
curl -X PUT http://localhost:3007/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Task Name"}'

# Delete a task (soft delete)
curl -X DELETE http://localhost:3007/api/tasks/1
```
