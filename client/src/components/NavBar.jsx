import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();

  // Opciones de navegacion basadas en el rol
  const linksByRole = {
    Paciente: [
      { to: "/paciente", label: "Inicio" },
      { to: "/paciente/perfil", label: "Perfil"},
    ],
    Medico: [
      { to: "/medico", label: "Panel Medico" },
      { to: "/medico/citas", label: "Citas" },
    ],
    Administrador: [
      { to: "/admin/postas", label: "Postas" },
      { to: "/admin/medicos", label: "Médicos" },
      { to: "/admin/consultorios", label: "Consultorios" },
    ],
  };

  // Enlaces que se mostraran, segun el rol del usuario
  const userLinks = user?.rol ? linksByRole[user.rol] || [] : [];

  return (
    isAuthenticated ? (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a class="navbar-brand" href="#">HealthTech</a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Enlaces especificos del rol */}
            {userLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <Link to={link.to} className="nav-link">{link.label}</Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Enlace de logout */}
            <li>
              <Link to="/" onClick={() => logout()} className="nav-link">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    ) : (
      <></>
    )
  );
}

export default NavBar;
