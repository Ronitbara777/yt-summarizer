# API Specifications

## 1. Authentication Routes (`/api/auth`)

### POST `/api/auth/register`
- **Description:** Creates a new user.
- **Request Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Response (201):** `{ "message": "User registered successfully" }`

### POST `/api/auth/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response (200):** `{ "token": "jwt_token_string_here", "user": { "id": "...", "name": "...", "email": "..." } }`

---

## 2. Summarizer Routes (`/api/summarize`)

### POST `/api/summarize` (Protected)
- **Description:** Generates a YouTube summary using Gemini AI.
- **Headers Required:** `Authorization: Bearer <jwt_token_string>`
- **Request Body:** `{ "url": "https://youtube.com/...", "transcript": "(optional)" }`
- **Response (200):** `{ "tldr": "...", "summary": "...", "takeaways": [...] }`
- **Error (401):** `{ "error": "Not authorized, token failed" }`
