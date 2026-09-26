from pydantic import BaseModel


class TodoCreate(BaseModel):
    title: str


class TodoOut(BaseModel):
    id: int
    title: str
    done: bool

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    text: str


class NoteOut(BaseModel):
    id: str
    text: str
