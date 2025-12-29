# API Documentation

> REST API reference for SecurePress

## Base URL

```
Development: http://localhost:8000/api
Production:  https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Obtain Token

```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin"
  },
  "tokens": {
    "access": "eyJ...",
    "refresh": "eyJ..."
  }
}
```

## Interactive Documentation

- **Swagger UI**: http://localhost:8000/api/schema/swagger-ui/
- **ReDoc**: http://localhost:8000/api/schema/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Core Endpoints

### Posts

```http
GET    /api/posts/          List all posts
GET    /api/posts/{slug}/   Get single post
POST   /api/posts/          Create post (auth required)
PUT    /api/posts/{slug}/   Update post (auth required)
DELETE /api/posts/{slug}/   Delete post (auth required)
```

### Pages

```http
GET    /api/pages/          List all pages
GET    /api/pages/{slug}/   Get single page
POST   /api/pages/          Create page (auth required)
PUT    /api/pages/{slug}/   Update page (auth required)
DELETE /api/pages/{slug}/   Delete page (auth required)
```

### Media

```http
GET    /api/media/          List media files
POST   /api/media/          Upload file (auth required, multipart/form-data)
DELETE /api/media/{id}/     Delete file (auth required)
```

### Users

```http
GET    /api/users/          List users (admin only)
GET    /api/users/me/       Get current user
PATCH  /api/users/update_profile/  Update profile
```

## Rate Limits

- Authentication: 5 requests/minute
- Read operations: 100 requests/minute
- Write operations: 30 requests/minute

## Error Responses

```json
{
  "detail": "Error message"
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Server Error

---

**For complete API documentation, visit the Swagger UI in your installation.**
