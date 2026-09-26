# 🚀 FullStackDemo — React + FastAPI + PostgreSQL + MongoDB

A **super-simple monorepo** for freshers to learn full-stack development and GitHub.

```
FullStackDemo/
├── frontend/          # React (Vite) — Sleek starter shell (status + build queue)
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

## 4️⃣ 🎓 Work board (GitHub Issues)

The frontend is an intentional starter shell — no demo features. Juniors build them via these issues (also linked in the app's Build queue):

1. **[Frontend] Build Todos panel on top of GET/POST /api/todos** ([#2](https://github.com/0xFreak/Full-Stack-Demo/issues/2)) — list + add form against the existing API. Start here.
2. **[Full-stack] Add priority field to Todos** ([#1](https://github.com/0xFreak/Full-Stack-Demo/issues/1)) — DB column → API validation → UI badge.
3. **[Backend + Docs] Add search to list endpoints and CI badge to README** ([#3](https://github.com/0xFreak/Full-Stack-Demo/issues/3)) — `?q=` search + Actions badge.

One PR per issue. Keep changes small, commit often. Good luck! 🎉
