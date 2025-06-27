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

This project uses Docker Compose to run:

- **Node.js backend** (Express + Prisma + JWT)
- **PostgreSQL database** with persistent volume

#### How to run

```bash
docker-compose up --build
