import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProgramacionCitaMedico } from "../../api/citas";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Programacion() {
  const { page, setPage } = usePagination();

  const [searchFilters, setSearchFilters] = useState({
    nombre: "",
    fecha: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    nombre: "",
    fecha: "",
    page: 1,
    limit: 10,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters({
      ...searchFilters,
      page: 1,
      limit: 10,
    });
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["programacionCitas", appliedFilters],
    queryFn: () => getProgramacionCitaMedico(appliedFilters),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    setPage(newPage);
  };

  if (isLoading) return <Loading nombre="horarios de atención..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error al cargar la programación" />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="mb-4">
          <h1 className="fw-bold mb-1">Mi Programación de Citas</h1>
          <p className="text-muted small mb-0">Horarios y cupos asignados en centros de salud</p>
        </div>

        {/* Filtros */}
        <div className="search-bar-container mb-4">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por nombre de posta..."
                  name="nombre"
                  value={searchFilters.nombre}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-calendar3"></i>
                </span>
                <input
                  type="date"
                  name="fecha"
                  value={searchFilters.fecha}
                  onChange={handleInputChange}
                  className="form-control border-start-0"
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-funnel me-1"></i> Filtrar
              </button>
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="card border-0 shadow-sm overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Consultorio</th>
                  <th>Posta</th>
                  <th>Horario</th>
                  <th>Cupos Totales</th>
                  <th>Cupos Disponibles</th>
                </tr>
              </thead>
              <tbody>
                {data.data && data.data.length > 0 ? (
                  data.data.map((cita) => (
                    <tr key={cita.idprogramacion_cita}>
                      <td className="fw-semibold text-dark">
                        <i className="bi bi-calendar2-event me-2 text-primary"></i>
                        {cita.fecha}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {cita.consultorio}
                        </span>
                      </td>
                      <td>{cita.posta}</td>
                      <td>
                        <span className="small text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {cita.hora}
                        </span>
                      </td>
                      <td>{cita.cupos_totales}</td>
                      <td>
                        <span
                          className={`badge ${
                            cita.cupos_disponibles > 0
                              ? "bg-success bg-opacity-10 text-success"
                              : "bg-danger bg-opacity-10 text-danger"
                          }`}
                        >
                          {cita.cupos_disponibles} restantes
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>
                      No se encontraron horarios programados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Programacion;
