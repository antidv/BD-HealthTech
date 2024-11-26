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
      <nav>
        <h1>HealthTech</h1>
        <ul>
          {/* Enlaces especificos del rol */}
          {userLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          {/* Enlace de logout */}
          <li>
            <Link to="/" onClick={() => logout()}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    ) : (
      <></>
    )
  );
}

export default NavBar;
