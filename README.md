# Universe Forma test
A simple CRM for GitHub repositories with user authentication, project listing and GitHub API integration

## Demo
Build and start up the services
```bash
docker compose up -d
```
and then open the [page](http://127.0.0.1:3001) in browser

## Backend implementation details

A handcrafted application

### Stack
- NestJS
- MongoDB
- Redis (for async processing with BullMQ)

### Areas for improvement

- Pagination for repositories dashboard
- Refresh tokens for JWT auth
- Better input validation
- Better error handling
- Database indexes
- Rate limiters for API endpoints
- Separate processes for async processors
- Caching for GitHub HTTP client
- Support for GitHub auth to view private repositories
- JSON logging
- Metrics
- E2E test coverage

## Frontend implementation details

Mostly written with AI

### Stack
- Next.js
- React

### Areas for improvement
- TBD