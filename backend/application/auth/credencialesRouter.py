from fastapi import APIRouter, HTTPException
from domain.auth.credencialesModel import CredencialesModel
from infrastructure.auth.credencialesInfraestructure import CredencialesInfrastructure

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(credenciales: CredencialesModel):
    usuario = CredencialesInfrastructure.login(credenciales)

    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {"mensaje": "Login exitoso", "usuario": usuario}