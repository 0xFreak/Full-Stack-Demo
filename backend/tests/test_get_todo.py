from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app import models
from app.db import Base
from app.main import app, get_db

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def _seed():
    db = TestingSession()
    db.add(models.Todo(title="Learn FastAPI"))
    db.commit()
    db.close()


def test_get_existing_todo():
    _seed()
    r = client.get("/api/todos/1")
    assert r.status_code == 200
    assert r.json() == {"id": 1, "title": "Learn FastAPI", "done": False}


def test_get_missing_todo_404():
    r = client.get("/api/todos/99999")
    assert r.status_code == 404
    assert r.json() == {"detail": "Todo not found"}


def test_get_non_integer_id_422():
    r = client.get("/api/todos/abc")
    assert r.status_code == 422
