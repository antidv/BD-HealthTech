import { useState } from "react";
import { Link } from "react-router-dom";

function SearchBar({ onSearch, nombre, url }) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch(search);
  };

  return (
    <div className="d-flex m-3">
      <input
        type="text"
        className="form-control w-25"
        placeholder="Buscar por nombre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn btn-primary ms-3" onClick={handleSearch}>
        Buscar
      </button>
      <Link to={url}>
        <button className="btn btn-primary ms-3" onClick={handleSearch}>
          Agregar {nombre}
        </button>
      </Link>
      
    </div>
  );
}

export default SearchBar;
