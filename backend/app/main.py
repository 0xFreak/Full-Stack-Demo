"""Simple FastAPI demo: Todos in Postgres, Notes in Mongo."""

from bson import ObjectId
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .config import settings
from .db import Base, check_mongo, check_postgres, engine, get_db, get_mongo_db

app = FastAPI(title="FullStackDemo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    # Create Postgres tables if they don't exist (simple for demo/freshers)
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"WARNING: could not create tables: {e}")


@app.get("/")
def root():
    return {"message": "FullStackDemo API is running. Try /api/health or /docs"}


@app.get("/api/health")
def health():
    pg = check_postgres()
    mg = check_mongo()
    status = "ok" if (pg and mg) else "degraded"
    return {"status": status, "postgres": "up" if pg else "down", "mongo": "up" if mg else "down"}


# ---- Todos (Postgres: relational example) ----
@app.get("/api/todos", response_model=list[schemas.TodoOut])
def list_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).order_by(models.Todo.id.desc()).all()


@app.post("/api/todos", response_model=schemas.TodoOut, status_code=201)
def create_todo(payload: schemas.TodoCreate, db: Session = Depends(get_db)):
    if not payload.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    todo = models.Todo(title=payload.title.strip())
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.patch("/api/todos/{todo_id}", response_model=schemas.TodoOut)
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.done = not todo.done
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return None


# ---- Notes (Mongo: document example) ----
@app.get("/api/notes", response_model=list[schemas.NoteOut])
def list_notes():
    db = get_mongo_db()
    notes = []
    for doc in db.notes.find().sort("_id", -1).limit(50):
        notes.append({"id": str(doc["_id"]), "text": doc["text"]})
    return notes


@app.post("/api/notes", response_model=schemas.NoteOut, status_code=201)
def create_note(payload: schemas.NoteCreate):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    db = get_mongo_db()
    result = db.notes.insert_one({"text": payload.text.strip()})
    return {"id": str(result.inserted_id), "text": payload.text.strip()}


@app.delete("/api/notes/{note_id}", status_code=204)
def delete_note(note_id: str):
    db = get_mongo_db()
    try:
        res = db.notes.delete_one({"_id": ObjectId(note_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note id")
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return None
