"""DB connections: Postgres via SQLAlchemy, Mongo via PyMongo."""

from pymongo import MongoClient
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings

# Postgres
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_postgres() -> bool:
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        return True
    except Exception:
        return False


# Mongo
_mongo_client: MongoClient | None = None


def get_mongo_client() -> MongoClient:
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = MongoClient(settings.mongo_url, serverSelectionTimeoutMS=2000)
    return _mongo_client


def get_mongo_db():
    return get_mongo_client()[settings.mongo_db]


def check_mongo() -> bool:
    try:
        get_mongo_client().admin.command("ping")
        return True
    except Exception:
        return False
