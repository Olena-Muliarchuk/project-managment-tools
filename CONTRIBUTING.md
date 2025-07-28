#  Contributing Guide
 This is a pet project for practicing full-stack development. Contributions are welcome — especially improvements, tests, and docs.

##  Structure
- `backend/` – Node.js + Express app (with Prisma + PostgreSQL)
- `frontend/` – (optional) planned client-side app

##  Setup
1. Clone the repository.
2. Follow backend setup in `backend/README.md`.

## Branching

- Use `main` for stable code.
- Create feature branches:
  ```
  feature/short-description
  fix/bug-description
  test/module-name
  ```

## Commit Messages

Follow the format:
```
<type>: short description
```
Examples:

- `feature: add task controller`
- `fix: correct token expiration check`
- `docs: update contributing guide`

## Tests
- Run unit tests:
  ```bash
  npm run test:unit
  ```
- Run integration tests (Docker):
  ```bash
  docker compose --profile tests up --build
  ```

## Linting
```bash
npm run lint
```

---

**Thank you for helping improve this project!**

