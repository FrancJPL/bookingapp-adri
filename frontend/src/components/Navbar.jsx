import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-brand">
        <Link to="/">BooKing app</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="hub-link">Sectores</Link>
        
        {/* Solo mostrar Reservar si no estamos en la Home o en Auth */}
        {!isHomePage && !isAuthPage && (
          <Link to="/booking">Reservar</Link>
        )}
        
        {user ? (
          <>
            <Link to="/my-reservations">Mis Citas</Link>
            
            {/* Solo Admin ve el Panel */}
            {user.id_rol === 3 && <Link to="/admin">Admin</Link>}
            
            {/* Admin y Empleados ven Calendario */}
            {(user.id_rol === 3 || user.id_rol === 2) && <Link to="/calendar">Agenda</Link>}

            <span className="user-greeting">Hola, {user.nombre}</span>
            <button onClick={handleLogout} className="logout-btn">Salir</button>
          </>
        ) : (
          <>
            {/* Solo mostrar Login y Registro si no estamos logueados */}
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-link">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;