import React, { useState, useEffect, useCallback } from "react";
import {
  crearEvento,
  obtenerEventos,
  eliminarEvento,
  obtenerDiasConEventos,
  actualizarEvento
} from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./calendario.css";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

function Calendario() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [diasConEventos, setDiasConEventos] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);

  const usuario_id = localStorage.getItem("usuario_id");
  const nombreUsuario = localStorage.getItem("usuario_nombre") || "Usuario";
  const hoy = new Date();

  useEffect(() => {
    if (!usuario_id) navigate("/");
  }, []);

  //  FECHA SIN PROBLEMAS DE ZONA HORARIA
  const fechaISOdeDia = useCallback((dia) => {
    const f = new Date(fecha.getFullYear(), fecha.getMonth(), dia);
    return f.toISOString().split("T")[0];
  }, [fecha]);

  //  CARGAR DÍAS CON EVENTOS (CORREGIDO PARA POSTGRESQL)
  const refrescarDias = useCallback(async () => {
    try {
      const dias = await obtenerDiasConEventos(
        usuario_id,
        fecha.getFullYear(),
        fecha.getMonth() + 1
      );

      // Asegurarse de que sea un array de números
      setDiasConEventos(dias || []);

    } catch (e) {
      console.error("Error cargando días:", e);
    }
  }, [fecha, usuario_id]);

  useEffect(() => {
    refrescarDias();
  }, [refrescarDias]);

  // ── Cargar eventos del día ──
  const refrescarEventos = useCallback(async (dia) => {
    if (!dia || !usuario_id) return;
    try {
      const data = await obtenerEventos(usuario_id, fechaISOdeDia(dia));
      setEventos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando eventos:", e);
    }
  }, [usuario_id, fechaISOdeDia]);

  useEffect(() => {
    if (diaSeleccionado) refrescarEventos(diaSeleccionado);
    else setEventos([]);
  }, [diaSeleccionado, refrescarEventos]);

  // ── Guardar evento ──
  const guardarEvento = async () => {
    if (!titulo.trim() || !descripcion.trim() || !diaSeleccionado || guardando) return;

    setGuardando(true);
    try {
      await crearEvento({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fecha: fechaISOdeDia(diaSeleccionado),
        usuario_id: parseInt(usuario_id),
      });

      setTitulo("");
      setDescripcion("");

      await refrescarEventos(diaSeleccionado);
      await refrescarDias();

    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar evento ──
  const borrarEvento = async (evento_id) => {
    await eliminarEvento(evento_id, usuario_id);
    await refrescarEventos(diaSeleccionado);
    await refrescarDias();
  };

  //actualizar evento
  const guardarEdicion = async () => {
    if (!eventoEditando || !eventoEditando.titulo?.trim() || !eventoEditando.descripcion?.trim()) return;
    await actualizarEvento(
      eventoEditando.id,
      usuario_id,
      eventoEditando.titulo,
      eventoEditando.descripcion
    );
    setEventoEditando(null);
    await refrescarEventos(diaSeleccionado);
  };


  // ── Cambiar mes ──
  const irMes = (delta) => {
    setDiaSeleccionado(null);
    setEventos([]);
    setFecha(new Date(fecha.getFullYear(), fecha.getMonth() + delta, 1));
  };

  // ── Seleccionar día ──
  const seleccionarDia = (d) => {
    if (d !== diaSeleccionado) {
      setTitulo("");
      setDescripcion("");
    }
    setDiaSeleccionado(d);
  };

  // ── Generar calendario ──
  const generarDias = () => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();
    const celdas = [];

    for (let i = 0; i < primerDia; i++) {
      celdas.push(<div key={`v-${i}`} className="cal-day-empty" />);
    }

    for (let d = 1; d <= ultimoDia; d++) {
      const esHoy =
        d === hoy.getDate() &&
        mes === hoy.getMonth() &&
        año === hoy.getFullYear();

      const esSeleccionado = d === diaSeleccionado;
      const tieneEventos = diasConEventos.includes(d);

      const clases = [
        "cal-day",
        esHoy ? "today" : "",
        esSeleccionado ? "selected" : "",
        tieneEventos ? "has-events" : "",
      ]
        .filter(Boolean)
        .join(" ");

      celdas.push(
        <button key={d} className={clases} onClick={() => seleccionarDia(d)}>
          <span className="cal-day-num">{d}</span>
          {tieneEventos && <span className="cal-dot" />}
        </button>
      );
    }

    return celdas;
  };

  const cerrarSesion = () => {
    ["usuario_id", "usuario_nombre", "usuario_email"].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate("/");
  };

  const fechaLegible = diaSeleccionado
    ? `${diaSeleccionado} de ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`
    : null;

  return (
    <div className="cal-page">

      {/* TOPBAR */}
      <header className="cal-topbar">
        <div className="cal-topbar-left">
          <div className="cal-logo"><span>A</span></div>

          <h2 className="cal-month-title">
            {MESES[fecha.getMonth()]} {fecha.getFullYear()}
          </h2>

          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={() => irMes(-1)}>←</button>
            <button className="cal-nav-btn" onClick={() => irMes(+1)}>→</button>
          </div>
        </div>

        <div className="cal-topbar-right">
          <span className="cal-user-name">👤 {nombreUsuario}</span>
          <button className="cal-logout-btn" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="cal-body">

        {/* CALENDARIO */}
        <section className="cal-grid-section">
          <div className="cal-day-names">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="cal-day-name">{d}</div>
            ))}
          </div>

          <div className="cal-grid">
            {generarDias()}
          </div>

          <div className="cal-legend">
            <span className="cal-legend-item">
              <span className="cal-legend-dot today-dot" />Hoy
            </span>
            <span className="cal-legend-item">
              <span className="cal-legend-dot selected-dot" />Seleccionado
            </span>
            <span className="cal-legend-item">
              <span className="cal-legend-dot event-dot" />Con notas
            </span>
          </div>
        </section>

        {/* PANEL DERECHO */}
        <aside className="cal-panel">
          {!diaSeleccionado ? (
            <div className="cal-panel-empty">
              <div className="cal-panel-empty-icon">📅</div>
              <p>Selecciona un día para ver o agregar notas</p>
            </div>
          ) : (
            <>
              <div className="cal-panel-header">
                <p className="cal-panel-title">Día seleccionado</p>
                <p className="cal-panel-date">{fechaLegible}</p>
              </div>

              {/* EVENTOS */}
              <div className="cal-events-list">
                <p className="cal-events-list-title">
                  {eventos.length === 0
                    ? "Sin notas este día"
                    : `${eventos.length} nota${eventos.length > 1 ? "s" : ""}`}
                </p>

                    {eventos.map((ev) => (
                    <div key={ev.id} className="cal-event-card">
                      <div className="cal-event-dot" />
                      {eventoEditando?.id === ev.id ? (
                        <div className="cal-event-content">
                          <input
                            className="form-input"
                            value={eventoEditando.titulo}
                            onChange={(e) => setEventoEditando({ ...eventoEditando, titulo: e.target.value })}
                          />
                          <textarea
                            className="cal-textarea"
                            value={eventoEditando.descripcion}
                            onChange={(e) => setEventoEditando({ ...eventoEditando, descripcion: e.target.value })}
                          />
                          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                            <button className="cal-save-btn" onClick={guardarEdicion}>Guardar</button>
                            <button className="cal-save-btn" onClick={() => setEventoEditando(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="cal-event-content">
                          <p className="cal-event-title">{ev.titulo}</p>
                          <p className="cal-event-desc">{ev.descripcion}</p>
                        </div>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <button className="cal-event-delete" onClick={() => setEventoEditando(ev)}>✏️</button>
                        <button className="cal-event-delete" onClick={() => borrarEvento(ev.id)}>✕</button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* FORM */}
              <div className="cal-new-event">
                <p className="cal-new-event-label">＋ Nueva nota</p>

                <input
                  className="form-input"
                  type="text"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />

                <textarea
                  className="cal-textarea"
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />

                <button
                  className="cal-save-btn"
                  onClick={guardarEvento}
                  disabled={!titulo.trim() || !descripcion.trim() || guardando}
                >
                  {guardando ? "Guardando..." : "Guardar nota"}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Calendario;