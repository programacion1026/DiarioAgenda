from fastapi import APIRouter,Query
from domain.agenda.eventoModel import EventoModel
from infrastructure.agenda.eventoInfrastructure import EventoInfrastructure

router = APIRouter(prefix="/eventos", tags=["Eventos"])

@router.post("/")
def crear_evento(evento: EventoModel):
    EventoInfrastructure.crear_evento(evento)
    return {"mensaje": "Evento creado"}

@router.get("/")
def listar_eventos(usuario_id: int, fecha: str):
    return EventoInfrastructure.obtener_eventos(usuario_id, fecha)


@router.get("/dias")
def dias_con_eventos(usuario_id: int, anio: int, mes: int):
    return EventoInfrastructure.obtener_dias_con_eventos(usuario_id, anio, mes)

@router.delete("/{evento_id}")
def eliminar_evento(evento_id: int, usuario_id: int):
    EventoInfrastructure.eliminar_evento(evento_id, usuario_id)
    return {"mensaje": "Evento eliminado"}

@router.put("/{evento_id}")
def actualizar_evento(evento_id: int, usuario_id: int, evento: EventoModel):
    EventoInfrastructure.actualizar_evento(
        evento_id,
        usuario_id,
        evento.titulo,
        evento.descripcion
    )
    return {"mensaje": "Evento actualizado"}