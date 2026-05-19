import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rutas según el rol del usuario.
 * @param {Array} allowedRoles - Lista de IDs de roles permitidos (1=Cliente, 2=Empleado, 3=Admin)
 */
function ProtectedRoute({ children, allowedRoles }) {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    // Si no está logueado, al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.id_rol)) {
    // Si no tiene el rol permitido, al inicio
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
