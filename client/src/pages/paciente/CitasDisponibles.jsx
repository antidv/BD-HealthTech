import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProgramacionCitasPaciente } from "../../api/citas";
import { getConsultorios } from "../../api/consultorios";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";

function CitasDisponibles() {
  const { page, setPage } = usePagination();

  // Obtener la fecha de mañana
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza a las 00:00:00
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Suma un día
  const formattedTomorrow = tomorrow.toISOString().split("T")[0]; // Formatea la fecha como YYYY-MM-DD

  // Filtros visibles en el formulario
  const [searchFilters, setSearchFilters] = useState({
    idconsultorio: "",
    fecha: formattedTomorrow, // Fecha mañana
  });

  // Filtros aplicados a la consulta
  const [appliedFilters, setAppliedFilters] = useState({
    idconsultorio: "",
    fecha: formattedTomorrow,
    page: 1,
    limit: 10,
  });

  // Manejar el cambio en los filtros del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el evento de búsqueda
  const handleSearch = () => {
    setAppliedFilters({
      ...searchFilters,
      page: 1,
      limit: 10,
    });
    setPage(1); // Reiniciar a la primera página
  };

  // Uso de useQuery con filtros dinámicos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["programacionCitas", appliedFilters],
    queryFn: () => getProgramacionCitasPaciente(appliedFilters),
    keepPreviousData: true,
  });

  // Obtener consultorios
  const {
    data: consultorios,
    isLoading: isCLoad,
    isError: isCError,
  } = useQuery({
    queryKey: ["consultorios"],
    queryFn: getConsultorios,
  });

  // Actualizar el estado de la página al cambiar de página
  const handlePageChange = (newPage) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    setPage(newPage);
  };

  if (isLoading || isCLoad) return <div>Cargando programación de citas...</div>;
  if (isError || isCError) return <div>Ha ocurrido un error</div>;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <h1 className="m-3">Citas disponibles</h1>
            <p className="m-3">
              Solo se muestran la programación de citas de las postas de su ciudad.
            </p>
            {/* Filtros */}
            <div className="d-flex m-3">
              {/* Select para consultorios */}
              <select
                className="form-control w-25"
                name="idconsultorio"
                value={searchFilters.idconsultorio}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un consultorio</option>
                {consultorios?.map((consultorio) => (
                  <option
                    key={consultorio.idconsultorio}
                    value={consultorio.idconsultorio}
                  >
                    {consultorio.nombre}
                  </option>
                ))}
              </select>
              {/* Input de fecha */}
              <input
                type="date"
                name="fecha"
                className="form-control ms-3 w-25"
                value={searchFilters.fecha}
                onChange={handleInputChange}
                min={formattedTomorrow}
              />
              <button className="btn btn-primary ms-3" onClick={handleSearch}>
                Buscar
              </button>
            </div>
            <div className="table-responsive m-3">
              {/* Tabla de citas */}
              <table border="1" style={{ width: "100%", marginTop: "20px" }} className="table table-info table-bordered">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Médico</th>
                    <th>Consultorio</th>
                    <th>Posta</th>
                    <th>Horario</th>
                    <th>Cupos Totales</th>
                    <th>Cupos Disponibles</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.length > 0 ? (
                    data.data.map((cita) => (
                      <tr key={cita.idprogramacion_cita}>
                        <td>{cita.fecha}</td>
                        <td>{cita.nombre + " " + cita.apellido}</td>
                        <td>{cita.consultorio}</td>
                        <td>{cita.posta}</td>
                        <td>{cita.hora}</td>
                        <td>{cita.cupos_totales}</td>
                        <td>{cita.cupos_disponibles}</td>
                        <td>
                          <Link
                            to={`/paciente/solicitar-cita/${cita.idprogramacion_cita}`}
                            className={`btn btn-primary ${
                              cita.cupos_disponibles === 0 ? "disabled" : ""
                            }`}
                          >
                            Solicitar
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No se encontraron citas programadas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
    
    
    
    
  );
}

export default CitasDisponibles;
