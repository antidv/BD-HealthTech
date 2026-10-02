import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProgramacionCitasPaciente } from "../../api/citas";
import { getConsultorios } from "../../api/consultorios";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function CitasDisponibles() {
  const { page, setPage } = usePagination();

  // Obtener la fecha de mañana
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];

  // Filtros visibles en el formulario
  const [searchFilters, setSearchFilters] = useState({
    idconsultorio: "",
    fecha: formattedTomorrow,
  });

  // Filtros aplicados a la consulta
  const [appliedFilters, setAppliedFilters] = useState({
    idconsultorio: "",
    fecha: formattedTomorrow,
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
    queryFn: () => getProgramacionCitasPaciente(appliedFilters),
    keepPreviousData: true,
  });

  const {
    data: consultorios,
    isLoading: isCLoad,
    isError: isCError,
  } = useQuery({
    queryKey: ["consultorios"],
    queryFn: getConsultorios,
  });

  const handlePageChange = (newPage) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    setPage(newPage);
  };

  if (isLoading || isCLoad) return <Loading nombre="citas disponibles..." />;
  if (isError || isCError) return <ErrorPage code={500} message="Ocurrió un error al consultar las citas" />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="mb-4">
          <h1 className="fw-bold mb-1">Citas Disponibles</h1>
          <p className="text-muted small mb-0">
            Reserva una cita médica en las postas de tu ciudad
          </p>
        </div>

        {/* Filtros */}
        <div className="search-bar-container mb-4">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-12 col-md-5">
              <select
                className="form-select"
                name="idconsultorio"
                value={searchFilters.idconsultorio}
                onChange={handleInputChange}
              >
                <option value="">Todos los consultorios</option>
                {consultorios?.map((consultorio) => (
                  <option
                    key={consultorio.idconsultorio}
                    value={consultorio.idconsultorio}
                  >
                    {consultorio.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={searchFilters.fecha}
                onChange={handleInputChange}
                min={formattedTomorrow}
              />
            </div>
            <div className="col-12 col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-search me-1"></i> Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de Citas */}
        <div className="card border-0 shadow-sm overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Médico</th>
                  <th>Consultorio</th>
                  <th>Posta</th>
                  <th>Horario</th>
                  <th>Cupos</th>
                  <th className="text-end pe-4">Acción</th>
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
                      <td>{cita.nombre + " " + cita.apellido}</td>
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
                      <td>
                        <span
                          className={`badge ${
                            cita.cupos_disponibles > 0
                              ? "bg-success bg-opacity-10 text-success"
                              : "bg-danger bg-opacity-10 text-danger"
                          }`}
                        >
                          {cita.cupos_disponibles} disp.
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <Link
                          to={`/paciente/solicitar-cita/${cita.idprogramacion_cita}`}
                          className={`btn btn-sm ${
                            cita.cupos_disponibles === 0
                              ? "btn-secondary disabled"
                              : "btn-warning"
                          }`}
                        >
                          <i className="bi bi-calendar-check me-1"></i>
                          Solicitar
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>
                      No se encontraron citas programadas con esos filtros.
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

export default CitasDisponibles;
