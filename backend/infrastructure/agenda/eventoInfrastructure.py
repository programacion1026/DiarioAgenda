from infrastructure.database.connection import engine
from sqlalchemy import text

class EventoInfrastructure:

    @staticmethod
    def crear_evento(evento):
        with engine.connect() as conn:
            query = text("""
                INSERT INTO eventos (titulo, descripcion, fecha, usuario_id)
                VALUES (:titulo, :descripcion, :fecha, :usuario_id)
            """)
            conn.execute(query, evento.__dict__)
            conn.commit()

    @staticmethod
    def obtener_eventos(usuario_id: int, fecha: str):
        with engine.connect() as conn:
            query = text("""
                SELECT * FROM eventos
                WHERE usuario_id = :usuario_id
                AND DATE(fecha) = DATE(:fecha)
                ORDER BY id DESC
            """)
            result = conn.execute(query, {"usuario_id": usuario_id, "fecha": fecha})
            return [dict(row._mapping) for row in result]

    @staticmethod
    def obtener_dias_con_eventos(usuario_id: int, anio: int, mes: int):
        with engine.connect() as conn:
            query = text("""
                SELECT DISTINCT EXTRACT(DAY FROM fecha)::int as dia
                FROM eventos
                WHERE usuario_id = :usuario_id
                AND EXTRACT(YEAR FROM fecha) = :anio
                AND EXTRACT(MONTH FROM fecha) = :mes
                ORDER BY dia
            """)
            result = conn.execute(query, {
                "usuario_id": usuario_id,
                "anio": anio,
                "mes": mes
            })
            return [row._mapping["dia"] for row in result]

    @staticmethod
    def eliminar_evento(evento_id: int, usuario_id: int):
        with engine.connect() as conn:
            query = text("""
                DELETE FROM eventos
                WHERE id = :evento_id AND usuario_id = :usuario_id
            """)
            conn.execute(query, {"evento_id": evento_id, "usuario_id": usuario_id})
            conn.commit()
    @staticmethod
    def actualizar_evento(evento_id: int, usuario_id: int, titulo: str, descripcion: str):
        with engine.begin() as conn:
            query = text("""
                UPDATE eventos
                SET titulo = :titulo, descripcion = :descripcion
                WHERE id = :evento_id AND usuario_id = :usuario_id
            """)
            conn.execute(query, {
                "titulo": titulo,
                "descripcion": descripcion,
                "evento_id": evento_id,
                "usuario_id": usuario_id
            })
