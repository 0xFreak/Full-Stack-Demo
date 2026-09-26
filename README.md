# 🚀 FullStackDemo — React + FastAPI + PostgreSQL + MongoDB

A **super-simple monorepo** for freshers to learn full-stack development and GitHub.

```
FullStackDemo/
├── frontend/          # React (Vite) — Todos (Postgres) + Notes (Mongo) UI
├── backend/           # FastAPI — REST API, /docs included
├── docker-compose.yml # postgres + mongo + backend + frontend
└── .github/workflows/ci.yml  # simple CI: pytest + npm build + docker build
```

## 1️⃣ Run it (only thing you need: Docker)

```bash
docker compose up --build
```

Then open:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8000        |
| API docs | http://localhost:8000/docs   |
| Health   | http://localhost:8000/api/health |

Stop: `docker compose down` — wipe DBs: `docker compose down -v`

## 2️⃣ Run without Docker (optional, for learning)

Backend:
```bash
cd backend
pip install -r requirements.txt
# needs local postgres + mongo, or edit app/config.py defaults
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

## 3️⃣ How it works (for freshers)

- **Frontend (React)** calls `http://localhost:8000/api/*` with `fetch`.
- **Backend (FastAPI)** exposes:
  - `GET /api/health` → checks both DBs
  - `GET/POST/PATCH/DELETE /api/todos` → stored in **PostgreSQL** (relational table)
  - `GET/POST/DELETE /api/notes` → stored in **MongoDB** (flexible JSON docs)
- **PostgreSQL** = structured rows (good for todos, users, orders).
- **MongoDB** = flexible documents (good for notes, logs, free-form JSON).

## 4️⃣ 🎓 3 Tasks for Juniors

### Task 1 — Easy: Add a "Clear completed" feel (Frontend only)
In `frontend/src/App.jsx`, add a button / filter for todos:
- e.g. show counts: "3 total, 1 done", or hide/show completed.
- File to change: `frontend/src/App.jsx` (+ maybe `index.css`).
- Success: `npm run build` passes in `frontend/`, UI shows the new feature via `docker compose up`.

### Task 2 — Medium: Add validation + a new field (Full-stack)
Add a `priority` (low/medium/high) to Todos:
1. Backend: add column in `backend/app/models.py`, update `schemas.py`, update `POST /api/todos` in `main.py`.
2. Frontend: dropdown when creating a todo + show priority badge.
3. DB tip: easiest is `docker compose down -v` to recreate the table (we use `create_all` for simplicity).
- Success: new todos save priority, visible in UI, old tests still pass (`pytest` in `backend/`).

### Task 3 — Harder: Search + CI badge (Backend + DevOps)
1. Backend: add search query param: `GET /api/todos?q=docker` and `GET /api/notes?q=...` (Postgres: `LIKE`, Mongo: regex).
2. Frontend: add a search box that calls the API with `?q=`.
3. CI: add a status badge to top of this README pointing at your repo's Actions (e.g. `[![CI](https://github.com/<you>/<repo>/actions/workflows/ci.yml/badge.svg)](...)`).
- Success: searching filters results live, `pytest` + `npm run build` still green in CI.

---
Made for learning: keep changes small, commit often, open PRs. Good luck! 🎉
