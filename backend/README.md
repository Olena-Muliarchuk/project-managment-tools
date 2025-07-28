# Backend – Project Management Tool

This is the backend service for a **project management tool**, similar to Trello or Asana.
It provides secure authentication, role-based access control, and task/project management features. Built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, fully dockerized for local development and testing.

## Tech Stack

-  **Node.js** with [Express](https://expressjs.com/)
-  **PostgreSQL** (via Docker) + [Prisma ORM](https://www.prisma.io/)
-  **JWT** Authentication (Access + Refresh Tokens)
-  **Role-based Access Control** (`manager`, `developer`)
-  **Middlewares**: `Helmet`, `CORS`, `Logger`, custom error handling
-  **Swagger** auto-generated API Docs
-  **Testing**: Mocha + Chai + Supertest
-  **Docker** + `docker-compose` for local development
-  **Prisma Studio** for DB inspection

##  Features

###  Auth
- Register / Login / Logout
- Access + Refresh Token flow
- Refresh token
- Role-based access (manager, developer)

###  User
-  `GET /api/users/me` – Get own profile
-  `PATCH /api/users/me` – Update own profile

###  Project
- CRUD for projects
- Access control via middleware

###  Task
- CRUD for tasks (linked to project and user)
- Access control middleware

###  Tests
- Unit tests for services
- Integration tests for `auth` and `user` modules

## API Docs
Swagger documentation auto-generated from YAML files. Once running:
```
http://localhost:5001/api/docs
```

To modify docs, edit files under:
```
/api-docs/*.yaml
```

## Getting Started

#### Docker-based development setup
This backend service runs inside Docker containers using **Docker Compose**. It includes:
- Express backend (port: `5001`)
- PostgreSQL DB (port: `5434`)
- Prisma Studio (optional, port: `5556`)
- Integration test runner (optional)

---

### 🔧 Setup & Run

#### 1. Clone repository

```bash
cd  backend
```

#### 2. Create `.env` file
Use the provided example:

`cp .env.example .env`

#### 3. Build and run services

```bash
docker  compose  up  --build  -d
```
-  `--build` ensures the latest code is used.
-  `-d` runs in background.

---

#### 4. Run database migrations
```bash
docker  compose  exec  backend  npx  prisma  migrate  dev  --name  init
```

(You can change the `--name` argument to describe the migration, e.g. `add_tasks_table`)

---

#### 5. View logs (optional)
```bash
docker  compose  logs  -f  backend
```

#### 6. Stop services

```bash
docker  compose  down
```

#### 7. Clean volumes + rebuild

```bash
docker  compose  down  -v

docker  compose  up  --build  -d
```

---  

##  Running Tests

### Unit tests

```bash
npm  run  test:unit
```

### Integration tests
Inside Docker:
```bash
docker  compose  --profile  tests  up  --build
```

Or manually:

```bash
docker  compose  exec  backend  npm  run  test:integration
```
---

## Prisma Studio

To explore database in browser:

```bash
docker  compose  --profile  studio  up  prisma-studio
```

Visit:

```

http://localhost:5556

```

## 🗖️ Roadmap (Next Steps)

- [ ]  **Comments Module**
- [ ] Add comments to tasks
- [ ] Edit/delete own comments
- [ ] View comment history (audit log)

- [ ]  **Notifications System**
- [ ] Notify assignees about task updates
- [ ] WebSocket-based real-time notifications

- [ ]  **CI/CD Integration**
- [ ] GitHub Actions for test & lint
- [ ] Auto-build Docker images on main

- [ ]  **Testing** 
- [x] Integration tests: `auth`, `user`
- [ ] Integration tests: `project`, `task`
- [ ] E2E tests with real DB in Docker

- [ ]   **Complete Swagger Docs** 

- [ ]    **Frontend Integration Plan**
- [ ] Add CORS policies for FE origin
