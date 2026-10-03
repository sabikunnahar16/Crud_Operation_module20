# Blog Management System API

Authenticated REST API for user accounts and blog posts, built with Node.js, Express, and MongoDB.

## Setup

1. Install Node.js 18+ and MongoDB.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a strong `JWT_SECRET`.
4. Start the API with `npm run dev` (development) or `npm start`.

The default server URL is `http://localhost:5000`.

## Authentication

`POST /api/auth/register` and `POST /api/auth/login` accept JSON:

```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "password123", "phoneNumber": "555-0100" }
```

Both endpoints return a JWT and set an HTTP-only `token` cookie. Clients may use either the cookie or `Authorization: Bearer <token>`. `GET /api/auth/profile` and `PATCH /api/auth/profile` require authentication.

## Blog endpoints

Every `/api/blogs` endpoint requires authentication:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/blogs` | Create a blog |
| GET | `/api/blogs` | List blogs |
| GET | `/api/blogs/:id` | Read one blog |
| PATCH | `/api/blogs/:id` | Update the creator's blog |
| DELETE | `/api/blogs/:id` | Delete the creator's blog |

Create and update requests may be JSON or `multipart/form-data`. The multipart field `blogImage` accepts images up to 5MB; `tags` may be a comma-separated string or an array. Uploaded images are served from `/uploads/...`.

## Suggested request examples

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My first post" \
  -F "content=Hello from the API" \
  -F "authorName=Ada Lovelace" \
  -F "tags=node,api"
```

## Security behavior

- Passwords are hashed with bcrypt and never returned.
- JWTs are signed with `JWT_SECRET` and validated on every protected request.
- Blog updates and deletes verify that the authenticated user owns the blog.
- CORS is credential-aware and configurable through `CLIENT_ORIGIN`.
