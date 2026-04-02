# URL Shortener API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Endpoints

### 1. Create Short URL
**POST** `/api/shorten`

Creates a short URL from a long URL.

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "expiryDate": "2024-12-31T23:59:59"
}
```

**Response:**
```json
{
  "id": 1,
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:8080/api/v1/abc123",
  "createdAt": "2024-01-01T10:00:00",
  "expiryDate": "2024-12-31T23:59:59",
  "clickCount": 0,
  "isActive": true
}
```

**Status Codes:**
- `201 Created` - URL shortened successfully
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

---

### 2. Redirect to Original URL
**GET** `/{shortCode}`

Redirects to the original URL and increments click count.

**Response:** HTTP 302 Redirect to original URL

**Status Codes:**
- `302 Found` - Redirect successful
- `404 Not Found` - Short code not found or expired

---

### 3. Get URL Statistics
**GET** `/api/stats/{shortCode}`

Returns detailed statistics for a short URL.

**Response:**
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "createdAt": "2024-01-01T10:00:00",
  "expiryDate": "2024-12-31T23:59:59",
  "clickCount": 42,
  "isActive": true,
  "lastAccessedAt": "2024-01-02T15:30:00",
  "shortUrl": "http://localhost:8080/api/v1/abc123"
}
```

**Status Codes:**
- `200 OK` - Statistics retrieved successfully
- `404 Not Found` - Short code not found

---

### 4. Get URL Information
**GET** `/api/info/{shortCode}`

Returns basic information about a short URL.

**Response:**
```json
{
  "id": 1,
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:8080/api/v1/abc123",
  "createdAt": "2024-01-01T10:00:00",
  "expiryDate": "2024-12-31T23:59:59",
  "clickCount": 42,
  "isActive": true
}
```

---

### 5. Deactivate URL
**DELETE** `/{shortCode}`

Deactivates a short URL (doesn't delete, just marks as inactive).

**Response:**
```json
{
  "message": "URL deactivated successfully",
  "shortCode": "abc123"
}
```

**Status Codes:**
- `200 OK` - URL deactivated successfully
- `404 Not Found` - Short code not found

---

### 6. Health Check
**GET** `/api/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T10:00:00",
  "service": "URL Shortener API",
  "version": "1.0.0",
  "activeUrls": 150
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "originalUrl": "Original URL is required",
    "expiryDate": "Expiry date must be in the future"
  },
  "timestamp": "2024-01-01T10:00:00"
}
```

### Not Found Error (404)
```json
{
  "status": "404",
  "message": "URL not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T10:00:00",
  "path": "GET /api/v1/nonexistent"
}
```

### Server Error (500)
```json
{
  "status": "500",
  "message": "An unexpected error occurred",
  "error": "Internal Server Error",
  "timestamp": "2024-01-01T10:00:00",
  "path": "POST /api/v1/api/shorten"
}
```

---

## Rate Limiting
- Currently not implemented, but should be added for production

## Security
- HTTPS should be enabled in production
- Input validation is implemented
- CORS is configured for frontend integration

## Caching
- Redis caching is implemented for performance
- Cache TTL: 1 hour
- Cache invalidation on URL expiry
