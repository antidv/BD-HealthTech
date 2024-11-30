import { useState } from "react";

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch(search);
  };

  return (
    <div className="container">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
