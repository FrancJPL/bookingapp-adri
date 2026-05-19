import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/booking.css";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sector = queryParams.get("sector") || "peluqueria";

  // Estados del formulario
  const [service, setService] = useState("");
  const [local, setLocal] = useState("");
  const [employee, setEmployee] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [level, setLevel] = useState("medio");
  const [players, setPlayers] = useState(4);
  const [extras, setExtras] = useState({ rackets: false, balls: false });

  // Estados de datos
  const [services, setServices] = useState([]);
  const [locals, setLocals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Sincronizar local desde URL
  useEffect(() => {
    const urlLocal = queryParams.get("local");
    if (urlLocal) setLocal(urlLocal);
  }, [location.search]);

  // Cargar servicios y locales iniciales
  useEffect(() => {
    fetch(`/api/servicios?categoria=${sector}`).then(res => res.json()).then(setServices);
    fetch(`/api/locales?categoria=${sector}`).then(res => res.json()).then(setLocals);
  }, [sector]);

  // Cargar empleados cuando cambia el local
  useEffect(() => {
    if (local) {
      setEmployee(""); // Limpiar empleado al cambiar local
      fetch(`/api/empleados?categoria=${sector}&id_local=${local}`).then(res => res.json()).then(setEmployees);
    } else {
      setEmployees([]);
    }
  }, [local, sector]);

  // Efecto para buscar disponibilidad
  useEffect(() => {
    if (service && employee && date) {
      setLoadingSlots(true);
      setTime(""); 
      fetch(`/api/disponibilidad?fecha=${date}&id_empleado=${employee}&id_servicio=${service}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data);
          setLoadingSlots(false);
        })
        .catch(() => {
          setLoadingSlots(false);
          alert("Error al cargar disponibilidad");
        });
    } else {
      setAvailableSlots([]);
    }
  }, [service, employee, date]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Debes iniciar sesión para reservar");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if (!service || !employee || !date || !time || !local) {
      alert("Por favor completa todos los campos, incluida la ubicación");
      return;
    }

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: user.id_usuario,
          id_local: local,
          id_empleado: employee,
          id_servicio: service,
          fecha: date,
          hora_inicio: time,
          observaciones: "Reserva inteligente"
        }),
      });

      if (response.ok) {
        alert("Reserva realizada con éxito");
        navigate("/my-reservations");
      } else {
        const data = await response.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="booking-container">
      <form className="booking-form" onSubmit={handleBooking}>
        <h2>Reservar cita</h2>
        <p className="booking-subtitle">Selecciona los detalles para ver horas disponibles</p>

        {/* Servicio */}
        <label>Servicio</label>
        <select value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">Selecciona un servicio</option>
          {services.map(s => (
            <option key={s.id_servicio} value={s.id_servicio}>
              {s.nombre} ({s.duracion_minutos} min) - {s.precio}€
            </option>
          ))}
        </select>
        
        {sector === 'padel' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Nivel de Juego</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="iniciacion">Iniciación</option>
                  <option value="medio">Intermedio / Regional</option>
                  <option value="avanzado">Avanzado / Pro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Jugadores</label>
                <select value={players} onChange={(e) => setPlayers(e.target.value)}>
                  <option value={2}>Individual (1 vs 1)</option>
                  <option value={4}>Dobles (2 vs 2)</option>
                </select>
              </div>
            </div>
            
            <div className="extras-container">
              <label className="checkbox-label">
                <input type="checkbox" checked={extras.rackets} onChange={(e) => setExtras({...extras, rackets: e.target.checked})} />
                Necesito alquilar palas (+5€)
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={extras.balls} onChange={(e) => setExtras({...extras, balls: e.target.checked})} />
                Comprar bote de bolas (+6€)
              </label>
            </div>
          </>
        )}

        {/* Local / Centro */}
        {!queryParams.get("local") ? (
          <>
            <label>{sector === 'padel' ? 'Club / Instalación' : 'Peluquería / Local'}</label>
            <select value={local} onChange={(e) => setLocal(e.target.value)} required>
              <option value="">Selecciona un local</option>
              {locals.map(l => (
                <option key={l.id_local} value={l.id_local}>
                  {l.nombre} - {l.direccion}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div className="selected-local-badge"> 📍 {locals.find(l => l.id_local == local)?.nombre || "Cargando local..."} </div>
        )}

        {/* Empleado */}
        <label>{sector === 'padel' ? 'Monitor (Opcional)' : 'Profesional'}</label>
        <select value={employee} onChange={(e) => setEmployee(e.target.value)} required={sector === 'peluqueria'}>
          <option value="">{sector === 'padel' ? 'Sin monitor (Solo alquiler)' : 'Selecciona un profesional'}</option>
          {employees.map(emp => (
            <option key={emp.id_usuario} value={emp.id_usuario}>
              {emp.nombre}
            </option>
          ))}
        </select>

        {/* Fecha */}
        <label>Fecha</label>
        <input
          type="date"
          value={date}
          required
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Selección de Slots */}
        <div className="slots-container">
          <label>Hora disponible</label>
          {loadingSlots ? (
            <div className="loader-mini">Buscando huecos...</div>
          ) : (
            <div className="slots-grid">
              {availableSlots.length > 0 ? (
                availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-btn ${time === slot ? 'selected' : ''}`}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="no-slots">
                  {service && employee && date 
                    ? "No hay huecos libres para este servicio y día." 
                    : "Selecciona servicio, empleado y fecha para ver horarios."}
                </p>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="submit-booking" disabled={!time}>
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
}

export default Booking;