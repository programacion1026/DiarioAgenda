from infrastructure.database.connection import engine
from sqlalchemy import text

class UsuarioInfrastructure:

    @staticmethod
    def crear_usuario(usuario):
        try:
            with engine.connect() as conn:
                query = text("""
                    INSERT INTO usuarios (nombre, email, password)
                    VALUES (:nombre, :email, :password)
                    RETURNING id
                """)

                result = conn.execute(query, {
                    "nombre": usuario.nombre,
                    "email": usuario.email,
                    "password": usuario.password
                })

                conn.commit()
                return result.fetchone()[0]

        except Exception as e:
            print("ERROR:", e)  # 👈 MUY IMPORTANTE
            return str(e)

    @staticmethod
    def obtener_usuarios():
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM usuarios"))
            return [dict(row._mapping) for row in result]

    @staticmethod
    def obtener_por_email(email):
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM usuarios WHERE email = :email"),
                {"email": email}
            )
            row = result.fetchone()
            return dict(row._mapping) if row else None