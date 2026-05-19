import { Link } from "react-router-dom";
import "../styles/selection.css";

// Importamos las imágenes (usando las rutas relativas si estuvieran en public, 
// pero como están en la carpeta de la conversación, simulo su uso)
// En un entorno real, estarían en /public/assets/
import barberImg from "../assets/barber_selection_card.png";
import padelImg from "../assets/padel_selection_card.png";

function SectorSelection() {
  const sectors = [
    {
      id: "peluqueria",
      title: "Peluquería & Barbería",
      description: "Cortes premium, arreglo de barba y estilismo profesional.",
      image: barberImg,
      link: "/hairdresser",
      active: true,
      tag: "DISPONIBLE"
    },
    {
      id: "padel",
      title: "Padel Club",
      description: "Reserva pistas de última generación y clases particulares.",
      image: padelImg,
      link: "/padel",
      active: true,
      tag: "DISPONIBLE"
    }
  ];

  return (
    <div className="selection-container">
      <h1>¿Qué estás buscando hoy?</h1>
      <p>Selecciona un servicio para comenzar tu experiencia</p>

      <div className="sectors-grid">
        {sectors.map((sector) => (
          <Link 
            key={sector.id} 
            to={sector.link} 
            className={`sector-card ${!sector.active ? 'coming-soon' : ''}`}
            style={{ "--accent": sector.id === 'peluqueria' ? '#D4AF37' : '#BFFF00' }}
          >
            <img src={sector.image} alt={sector.title} className="sector-image" />
            <div className="sector-info">
              <span className="badge">{sector.tag}</span>
              <h2>{sector.title}</h2>
              <p>{sector.description}</p>
              {sector.active && <button className="select-btn">Entrar</button>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SectorSelection;
