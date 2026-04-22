from pydantic import BaseModel, EmailStr
from datetime import datetime

class UsuarioModel(BaseModel):
    id: int | None = None
    nombre: str
    email: EmailStr
    password: str
    fecha_registro: datetime = datetime.now()