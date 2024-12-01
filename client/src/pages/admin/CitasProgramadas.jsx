import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProgracionCitas, deleteProgramacionCita } from "../../api/citas";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";

function CitasProgramadas() {
  const { page, setPage } = usePagination();
  const queryClient = useQueryClient();

  // Filtros visibles en el formulario
  const [searchFilters, setSearchFilters] = useState({
    nombre: "",
    fecha: "",
  });

  // Filtros aplicados en la consulta
  const [appliedFilters, setAppliedFilters] = useState({
    nombre: "",
    fecha: "",
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
    queryFn: () => getProgracionCitas(appliedFilters),
    keepPreviousData: true,
  });

  // Eliminar programacion
  const deleteMutation = useMutation({
    mutationFn: deleteProgramacionCita,
    onSuccess: () => {
      queryClient.invalidateQueries(["programacionCitas"]);
    },
  });

  // Manejar la eliminacion
  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar esta programación de cita?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Actualizar el estado de la página al cambiar de página
  const handlePageChange = (newPage) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    setPage(newPage);
  };

  if (isLoading) return <div>Cargando citas...</div>;
  if (isError) return <div>Ha ocurrido un error</div>;

  return (
    <div>
      <h1>Lista de Citas Programadas</h1>
      {/* Filtros */}
      <div className="d-flex m-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar por nombre de posta"
          name="nombre"
          value={searchFilters.nombre}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="fecha"
          value={searchFilters.fecha}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary ms-3" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {/* Tabla de citas */}
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
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
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={cita.cupos_totales > cita.cupos_disponibles}
                    onClick={() => handleDelete(cita.idprogramacion_cita)}
                  >
                    Eliminar
                  </button>
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

      {/* Paginación */}
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default CitasProgramadas;
