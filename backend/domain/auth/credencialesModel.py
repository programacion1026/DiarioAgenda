from pydantic import BaseModel

class CredencialesModel(BaseModel):
    email: str
    password: str