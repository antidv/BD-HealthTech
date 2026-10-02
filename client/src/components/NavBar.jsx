import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // Opciones de navegacion basadas en el rol con iconos
  const linksByRole = {
    Paciente: [
      { to: "/paciente/citas", label: "Mis citas", icon: "bi-calendar2-check" },
      { to: "/paciente/citas-disponibles", label: "Citas disponibles", icon: "bi-calendar-plus" },
      { to: "/paciente/antecedentes", label: "Antecedentes médicos", icon: "bi-file-earmark-medical" },
    ],
    Medico: [
      { to: "/medico/citas", label: "Mis citas", icon: "bi-calendar2-check" },
      { to: "/medico/programacion", label: "Programación de citas", icon: "bi-clock-history" },
      { to: "/medico/consultorios", label: "Consultorios", icon: "bi-hospital" },
    ],
    Administrador: [
      { to: "/admin/postas", label: "Postas", icon: "bi-buildings" },
      { to: "/admin/medicos", label: "Médicos", icon: "bi-person-badge" },
      { to: "/admin/programacion-citas", label: "Citas", icon: "bi-calendar-week" },
    ],
  };

  // Enlaces que se mostraran, segun el rol del usuario
  const userLinks = user?.rol ? linksByRole[user.rol] || [] : [];

  return isAuthenticated ? (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid px-lg-4">
        <Link to="/" className="navbar-brand text-decoration-none">
          <i className="bi bi-heart-pulse-fill text-primary fs-4"></i>
          <span>HealthTech</span>
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
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
          <div className="navbar-nav ms-lg-3">
            {/* Enlaces especificos del rol */}
            {userLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link d-inline-flex align-items-center gap-2 ${
                  location.pathname === link.to ? "active" : ""
                }`}
              >
                {link.icon && <i className={`bi ${link.icon}`}></i>}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Contenedor usuario y logout alineado a la derecha */}
          <div className="ms-auto d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {user?.rol && (
              <span className="navbar-role-badge">
                <i className="bi bi-shield-check me-1"></i>
                {user.rol}
              </span>
            )}
            <Link
              to="/"
              onClick={() => logout()}
              className="navbar-logout-btn text-danger text-decoration-none"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Cerrar sesión</span>
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
