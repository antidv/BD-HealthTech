import { useState } from "react";
import { Link } from "react-router-dom";

function SearchBar({ onSearch, nombre, url }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div className="search-bar-container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
      <form onSubmit={handleSearch} className="d-flex align-items-center gap-2 w-100 flex-grow-1" style={{ maxWidth: "500px" }}>
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary px-3 text-nowrap">
          Buscar
        </button>
      </form>

      {url && nombre && (
        <Link to={url} className="btn btn-warning fw-bold text-nowrap px-4 shadow-sm">
          <i className="bi bi-plus-lg me-1"></i>
          Agregar {nombre}
        </Link>
      )}
    </div>
  );
}

export default SearchBar;
