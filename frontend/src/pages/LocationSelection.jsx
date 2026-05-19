import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/selection.css"; // Reutilizamos estilos de selección

function LocationSelection() {
  const [locations, setLocations] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sector = queryParams.get("sector") || "peluqueria";

  useEffect(() => {
    fetch(`/api/locales?categoria=${sector}`)
      .then(res => res.json())
      .then(setLocations);
  }, [sector]);

  return (
    <div className="selection-container">
      <h1>¿A qué centro quieres ir?</h1>
      <p>Selecciona tu ubicación preferida para {sector === 'peluqueria' ? 'tu cambio de look' : 'tu próximo partido'}</p>

      <div className="sectors-grid">
        {locations.map((loc) => (
          <Link 
            key={loc.id_local} 
            to={`/booking?sector=${sector}&local=${loc.id_local}`} 
            className="sector-card"
            style={{ "--accent": sector === 'peluqueria' ? '#D4AF37' : '#BFFF00' }}
          >
            <div className="location-card-image">
               {/* Usamos imágenes reales si existen, si no un placeholder elegante */}
               {loc.id_local === 1 ? (
                 <img src="/src/assets/barbershop_centro.png" alt={loc.nombre} />
               ) : loc.id_local === 2 ? (
                 <img src="/src/assets/barbershop_norte.png" alt={loc.nombre} />
               ) : loc.id_local === 3 ? (
                 <img src="/src/assets/padel_hero_bg.png" alt={loc.nombre} />
               ) : (
                 <div className="location-icon-placeholder">
                   {sector === 'peluqueria' ? '💈' : '🎾'}
                 </div>
               )}
            </div>
            <div className="sector-info">
              <span className="location-tag">{sector === 'peluqueria' ? 'Barbería Premium' : 'Sports Club'}</span>
              <h2>{loc.nombre}</h2>
              <p className="location-address">📍 {loc.direccion}</p>
              <div className="location-meta">
                <span>⭐ 4.9</span>
                <span>•</span>
                <span>Abierto hoy</span>
              </div>
              <button className="select-btn">Reservar Aquí</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LocationSelection;
