from pydantic import BaseModel
from datetime import datetime

class EventoModel(BaseModel):
    id: int | None = None
    titulo: str | None = None
    descripcion: str | None = None
    fecha: datetime  | None = None
    usuario_id: int | None = None