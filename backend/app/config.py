from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://demo:demo@localhost:5432/demo"
    mongo_url: str = "mongodb://localhost:27017"
    mongo_db: str = "demo"

    class Config:
        env_file = ".env"


settings = Settings()
