const API_URL = "http://127.0.0.1:7000";

// USUARIOS
export const crearUsuario = async (usuario) => {
  const response = await fetch(`${API_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: usuario.nombre,
      email: usuario.correo,
      password: usuario.contrasena,
    }),
  });
  return response.json();
};

// LOGIN
export const loginUsuario = async (credenciales) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credenciales.correo,
      password: credenciales.contrasena,
    }),
  });
  return response.json();
};

// CREAR EVENTO
export const crearEvento = async (evento) => {
  const response = await fetch(`${API_URL}/eventos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });
  return response.json();
};

// OBTENER EVENTOS de un día (filtrados por usuario y fecha)
export const obtenerEventos = async (usuario_id, fecha) => {
  const response = await fetch(
    `${API_URL}/eventos/?usuario_id=${usuario_id}&fecha=${encodeURIComponent(fecha)}`
  );
  return response.json();
};

// OBTENER DÍAS DEL MES QUE TIENEN EVENTOS  ← ruta cambiada a /dias
export const obtenerDiasConEventos = async (usuario_id, anio, mes) => {
  const response = await fetch(
    `${API_URL}/eventos/dias?usuario_id=${usuario_id}&anio=${anio}&mes=${mes}`
  );
  return response.json();
};

// ELIMINAR EVENTO
export const eliminarEvento = async (evento_id, usuario_id) => {
  const response = await fetch(
    `${API_URL}/eventos/${evento_id}?usuario_id=${usuario_id}`,
    { method: "DELETE" }
  );
  return response.json();
};

// ACTUALIZAR EVENTO
export const actualizarEvento = async (evento_id, usuario_id, titulo, descripcion) => {
  const response = await fetch(
    `${API_URL}/eventos/${evento_id}?usuario_id=${usuario_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion }),
    }
  );
  return response.json();
};