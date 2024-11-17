import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    isAuthenticated ? (
      <nav>
        <h1>Logo</h1>
        <ul>
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
