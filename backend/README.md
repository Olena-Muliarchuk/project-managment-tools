# Backend – Project Management Tool

This is the backend service for a **project management tool**, similar to Trello or Asana.
It handles authentication, user roles, task/project management, notifications, and future real-time updates via WebSocket.

## Tech Stack

- **Node.js** with [Express](https://expressjs.com/)
- **PostgreSQL** (via Docker) + [Prisma ORM](https://www.prisma.io/)
- **JWT** Authentication
- **Middlewares**: `Helmet`, `CORS`, `Logger`, custom error handling
- **Docker** + `docker-compose` for local development
---

## Getting Started

### 1. Clone the repository

### 2. Install dependencies

### 3. Create .env file

### 4. Run the server

#### Docker-based development setup
This backend service runs inside Docker containers using **Docker Compose**. It includes:

-  Node.js Express backend with Prisma ORM and JWT authentication
-  PostgreSQL database with persistent volume
-  Prisma Studio for inspecting the database in browser

1.  Start all services

```bash
docker compose up --build -d
```
```--build``` ensures containers are rebuilt from the latest changes

```-d``` runs containers in background

2. View backend logs (optional)

```bash
docker compose logs -f backend
```
3. Access Prisma Studio (browser GUI for DB)
Once the containers are running, open in your browser:
```
http://localhost:5555
```
You can inspect and edit data from your database visually.

4. To stop services:
```
docker compose down
```
5. To rebuild with clean volumes:
```bash
docker compose down -v
docker compose up --build -d
``` 
