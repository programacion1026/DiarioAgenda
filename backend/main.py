import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from application.webapidiario_agenda import app


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
#  Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def start():
    uvicorn.run(
        "application.webapidiario_agenda:app",
        host="127.0.0.1",
        port=7000,
        reload=True
    )

if __name__ == "__main__":
    start()