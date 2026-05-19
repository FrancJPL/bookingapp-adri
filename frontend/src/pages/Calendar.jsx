import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useNavigate } from "react-router-dom";
import "../styles/calendar.css";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(userStr);

    const isPro = userData.id_rol === 2 || userData.id_rol === 3;
    const endpoint = isPro 
      ? `/api/reservas/empleado/${userData.id_usuario}`
      : `/api/reservas/usuario/${userData.id_usuario}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        // Filtrar solo las que NO estén canceladas para no ensuciar el calendario
        const activeReservations = data.filter(res => res.estado !== 'cancelada');
        
        const formattedEvents = activeReservations.map(res => ({
          id: res.id_reserva,
          title: isPro ? `${res.servicio_nombre} - ${res.cliente_nombre}` : res.servicio_nombre,
          start: `${res.fecha.split('T')[0]}T${res.hora_inicio}`,
          end: `${res.fecha.split('T')[0]}T${res.hora_fin}`,
          backgroundColor: isPro ? 'var(--accent-color)' : '#3b82f6',
          borderColor: 'transparent',
          extendedProps: { ...res }
        }));
        setEvents(formattedEvents);
      })
      .catch(err => console.error("Error al cargar calendario:", err));
  }, [navigate]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Mi Agenda</h1>
        <p>Gestiona tus citas y disponibilidad</p>
      </div>

      <div className="calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          slotMinTime="09:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          height="auto"
          locale="es"
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
          }}
        />
      </div>

      {/* Modal de Detalles */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={closeEventModal}>
          <div className="event-details-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeEventModal}>&times;</button>
            <div className="modal-header">
              <h3>Detalles de la Cita</h3>
              <span className={`status-badge ${selectedEvent.estado}`}>{selectedEvent.estado}</span>
            </div>
            
            <div className="modal-body">
              <div className="detail-item">
                <label>Servicio</label>
                <p>{selectedEvent.servicio_nombre}</p>
              </div>
              
              <div className="detail-item">
                <label>Cliente</label>
                <p>{selectedEvent.cliente_nombre || "Usuario"}</p>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Fecha</label>
                  <p>{new Date(selectedEvent.fecha).toLocaleDateString()}</p>
                </div>
                <div className="detail-item">
                  <label>Horario</label>
                  <p>{selectedEvent.hora_inicio.substring(0, 5)} - {selectedEvent.hora_fin?.substring(0, 5)}</p>
                </div>
              </div>

              {selectedEvent.observaciones && (
                <div className="detail-item">
                  <label>Observaciones</label>
                  <p className="observations">{selectedEvent.observaciones}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="primary-modal-btn" onClick={closeEventModal}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Calendar;