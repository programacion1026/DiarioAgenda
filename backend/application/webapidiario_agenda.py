from fastapi import FastAPI
from application.auth.credencialesRouter import router as credencialesRouter
from application.usuarios.usuarioRouter import router as usuariosRouter
from application.agenda.eventoRouter import router as eventoRouter

app= FastAPI(
    title="API Diário de Agenda",
    description="API para gerenciamento de agenda",
    version="1.0.0"
)
app.include_router(credencialesRouter)
app.include_router(usuariosRouter)
app.include_router(eventoRouter)
