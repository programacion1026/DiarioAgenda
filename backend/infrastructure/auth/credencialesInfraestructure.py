from infrastructure.usuarios.usuarioInfraestructure import UsuarioInfrastructure

class CredencialesInfrastructure:

    @staticmethod
    def login(credenciales):
        usuario = UsuarioInfrastructure.obtener_por_email(credenciales.email)

        if not usuario:
            return None

        if usuario["password"] != credenciales.password:
            return None

        return usuario