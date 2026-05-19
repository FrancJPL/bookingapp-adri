import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/myreservations.css";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchReservations = useCallback((userData) => {
    const isPro = userData.id_rol === 2 || userData.id_rol === 3;
    const endpoint = isPro 
      ? `/api/reservas/empleado/${userData.id_usuario}`
      : `/api/reservas/usuario/${userData.id_usuario}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(setReservations)
      .catch(err => console.error("Error al cargar reservas:", err));
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchReservations(userData);
  }, [navigate, fetchReservations]);

  const updateStatus = async (id, newStatus) => {
    const confirmMsg = newStatus === 'cancelada' 
      ? "¿Estás seguro de que deseas anular esta cita?" 
      : "¿Confirmar esta cita?";
    
    if (window.confirm(confirmMsg)) {
      try {
        const response = await fetch(`/api/reservas/${id}/estado`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: newStatus })
        });
        
        if (response.ok) {
          fetchReservations(user);
        } else {
          alert("Error al actualizar el estado");
        }
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  if (!user) return null;

  const isPro = user.id_rol === 2 || user.id_rol === 3;

  return (
    <div className="reservations-container">
      <h1>{isPro ? "Mi Agenda de Citas" : "Mis reservas"}</h1>

      {reservations.length === 0 ? (
        <p className="no-reservations">No hay citas registradas</p>
      ) : (
        <div className="reservations-list">
          {reservations.map((res) => (
            <div key={res.id_reserva} className="reservation-card">
              <span className="res-id">#{res.id_reserva}</span>
              <h3>{res.servicio_nombre}</h3>
              

              
              {isPro ? (
                <p><strong>Cliente:</strong> {res.cliente_nombre}</p>
              ) : (
                <p><strong>Profesional:</strong> {res.empleado_nombre}</p>
              )}
              
              <p><strong>Fecha:</strong> {new Date(res.fecha).toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {res.hora_inicio.substring(0, 5)} - {res.hora_fin?.substring(0, 5)}</p>
              <p><strong>Estado:</strong> <span className={`status-badge ${res.estado}`}>{res.estado}</span></p>

              <div className="card-actions">
                {isPro && res.estado === 'pendiente' && (
                  <button className="confirm-btn" onClick={() => updateStatus(res.id_reserva, 'confirmada')}>
                    Confirmar
                  </button>
                )}
                
                {res.estado !== 'cancelada' && (
                  <button className="cancel-btn" onClick={() => updateStatus(res.id_reserva, 'cancelada')}>
                    Anular
                  </button>
                )}

                {res.estado === 'cancelada' && <p className="cancelled-text">Cita anulada</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;