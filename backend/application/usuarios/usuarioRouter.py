from fastapi import APIRouter
from domain.usuarios.usuarioModel import UsuarioModel
from infrastructure.usuarios.usuarioInfraestructure import UsuarioInfrastructure

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/")
def crear_usuario(usuario: UsuarioModel):
    id = UsuarioInfrastructure.crear_usuario(usuario)
    return {"mensaje": "Usuario creado", "id": id}

@router.get("/")
def listar():
    return UsuarioInfrastructure.obtener_usuarios()