import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // Opciones de navegacion basadas en el rol
  const linksByRole = {
    Paciente: [
      { to: "/paciente", label: "Inicio" },
      { to: "/paciente/perfil", label: "Perfil" },
    ],
    Medico: [
      { to: "/medico", label: "Panel Medico" },
      { to: "/medico/citas", label: "Citas" },
    ],
    Administrador: [
      { to: "/admin/postas", label: "Postas" },
      { to: "/admin/medicos", label: "Médicos" },
    ],
  };

  // Enlaces que se mostraran, segun el rol del usuario
  const userLinks = user?.rol ? linksByRole[user.rol] || [] : [];

  return isAuthenticated ? (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">HealthTech</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {/* Enlaces especificos del rol */}
            {userLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${
                  location.pathname === link.to ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/" onClick={() => logout()} className="nav-link">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  ) : (
    <></>
  );
}

export default NavBar;