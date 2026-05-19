import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import barberHero from "../assets/barber_hero_bg.png";
import teamImg from "../assets/stylist_team.png";
import padelHero from "../assets/padel_hero_bg.png";

function Home({ sector = "peluqueria" }) {
  const navigate = useNavigate();

  const content = {
    peluqueria: {
      heroTitle: "Cortes de Autor & Barbería Premium",
      heroSubtitle: "Eleva tu estilo con maestros del detalle en un entorno de lujo diseñado para ti.",
      services: [
        { title: "Corte de Pelo Premium", price: "25€", desc: "Lavado, corte adaptado y acabado profesional." },
        { title: "Corte + Barba Style", price: "35€", desc: "El combo definitivo para una imagen impecable." },
        { title: "Tratamiento Spa Capilar", price: "15€", desc: "Hidratación profunda y masaje relajante." }
      ],
      team: [
        { name: "Marco Rossi", role: "Master Barber", specialty: "Degradados & Afeitado Clásico" },
        { name: "Elena Varma", role: "Top Stylist", specialty: "Colorimetría & Cortes de Tendencia" }
      ],
      testimonials: [
        { name: "Juan Pérez", comment: "El mejor corte que me han hecho en años. El trato es impecable y el ambiente muy relajante.", rating: 5 },
        { name: "Carlos Ruiz", comment: "Excelente servicio de barbería. Marco es un auténtico maestro de las tijeras.", rating: 5 },
        { name: "Andrés García", comment: "Un lugar premium de verdad. Vale cada euro por la atención y el resultado.", rating: 4 }
      ]
    },
    padel: {
      heroTitle: "Elite Padel Performance Center",
      heroSubtitle: "Instalaciones de alto rendimiento para jugadores que buscan la excelencia en cada partido.",
      services: [
        { title: "Reserva de Pista Central", price: "25€/h", desc: "Pista panorámica oficial WPT con iluminación Pro LED." },
        { title: "Entrenamiento Personalizado", price: "45€/h", desc: "Sesión intensiva técnica y táctica con monitor titulado." },
        { title: "Match-Making Avanzado", price: "Gratis", desc: "Te buscamos rivales de tu mismo nivel (2.5 a 5.0)." }
      ],
      team: [
        { name: "Carlos Sanz", role: "Head Coach", specialty: "Ex-jugador WPT & Táctica" },
        { name: "Laura Giner", role: "Monitora Pro", specialty: "Técnica de Base & Competición" }
      ],
      features: [
        { icon: "🎾", title: "Material Pro", desc: "Alquiler de palas de gama alta y botes de bolas nuevos." },
        { icon: "🧊", title: "Crio-Recuperación", desc: "Zona de recuperación post-partido para socios." },
        { icon: "📱", title: "Replay Video", desc: "Graba tus partidos y analízalos desde nuestra App." }
      ],
      testimonials: [
        { name: "Santi Ramos", comment: "Las mejores pistas de la zona. El mantenimiento es excelente y la iluminación nocturna es de 10.", rating: 5 },
        { name: "Lucía M.", comment: "Me encanta el sistema de match-making. Siempre encuentro gente de mi nivel para jugar.", rating: 5 },
        { name: "Pablo Ferrero", comment: "Muy buen ambiente y los monitores son super profesionales. Muy recomendable.", rating: 4 }
      ]
    }
  };

  const currentContent = content[sector] || content.peluqueria;

  return (
    <div className="home-container" data-sector={sector}>
      {/* HERO SECTION */}
      <section className="hero-section" style={{ backgroundImage: sector === 'peluqueria' ? `url(${barberHero})` : `url(${padelHero})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{currentContent.heroTitle}</h1>
          <p>{currentContent.heroSubtitle}</p>
          <button className="cta-btn" onClick={() => navigate(`/locations?sector=${sector}`)}>
            Reservar Experiencia
          </button>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section">
        <span className="section-tag">Nuestros Servicios</span>
        <h2>Excelencia en cada detalle</h2>
        <div className="services-grid">
          {currentContent.services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="card-top">
                <h3>{s.title}</h3>
                <span className="price">{s.price}</span>
              </div>
              <p>{s.desc}</p>
              <div className="card-spacer"></div>
              <button
                onClick={() => navigate(`/booking?sector=${sector}`)}
                aria-label={`Elegir el servicio ${s.title}`}
              >
                Elegir
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION (Only for Hairdresser for now) */}
      {sector === 'peluqueria' && (
        <section className="team-section">
          <div className="team-layout">
            <div className="team-info">
              <span className="section-tag">Expertos</span>
              <h2>Conoce a nuestros Maestros</h2>
              <p>Un equipo apasionado por la estética y el cuidado personal, formado en las mejores academias internacionales.</p>
              <div className="team-grid">
                {currentContent.team.map((t, i) => (
                  <div key={i} className="team-member">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                    <small>{t.specialty}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="team-image-container">
              <img src={teamImg} alt="Equipo de profesionales y estilistas de Style & Courts" />
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS SECTION */}
      {currentContent.testimonials && (
        <section className="testimonials-section">
          <span className="section-tag">Opiniones</span>
          <h2>Lo que dicen nuestros clientes</h2>
          <div className="testimonials-grid">
            {currentContent.testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <p>"{t.comment}"</p>
                <strong>- {t.name}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FEATURES SECTION (Clean Layout) */}
      <section className="features-section">
        {(currentContent.features || [
          { icon: "🏆", title: "Calidad Garantizada", desc: "Solo utilizamos productos premium para resultados superiores." },
          { icon: "🕒", title: "Puntualidad", desc: "Respetamos tu tiempo. Sin esperas innecesarias." },
          { icon: "✨", title: "Ambiente Relajado", desc: "Disfruta de una bebida mientras cuidamos de ti." }
        ]).map((f, i) => (
          <div key={i} className="feature">
            <div className="icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
