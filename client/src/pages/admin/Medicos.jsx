import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicosAdmin } from "../../api/medicos";
import { cambiarEstadoMedico } from "../../api/medicos";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardMedico from "../../components/cards/CardMedico";
import SearchBar from "../../components/SearchBar";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Medicos() {
  const { page, setPage } = usePagination();
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();

  const {
    data: medicos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medicos", { page, limit: 9, search: filter }],
    queryFn: () => getMedicosAdmin({ page, limit: 9, search: filter }),
    keepPreviousData: true,
  });

  // Mutacion para habilitar - deshabilitar conmedposta
  const mutation = useMutation({
    mutationKey: ["toggleEstadoMedico"],
    mutationFn: (id) => cambiarEstadoMedico(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["medicos"]);
    },
  });

  const handleToggleEstadoMedico = (id) => {
    mutation.mutate(id);
  };

  const handleSearch = (search) => {
    setFilter(search);
    setPage(1);
  };

  if (isLoading) return <Loading nombre="médicos ..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error ..." />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1">Médicos</h1>
            <p className="text-muted small mb-0">Gestión de personal médico y especialidades</p>
          </div>
        </div>

        {/* Barra de busqueda */}
        <SearchBar
          onSearch={handleSearch}
          nombre="médico"
          url="/admin/registrar/medico"
        />

        {/* Renderizado de cards */}
        <div className="row g-4">
          {medicos.data.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-person-x text-muted fs-1 mb-2 d-block"></i>
              <p className="text-muted">No se encontraron médicos con ese criterio.</p>
            </div>
          ) : (
            medicos.data.map((medico) => (
              <CardMedico
                key={medico.idmedico}
                id={medico.idmedico}
                foto={medico.foto}
                nombre={`${medico.nombre} ${medico.apellidoP}`}
                especialidad={medico.especialidad}
                estado={medico.disponible}
                idmedico={medico.idmedico}
                handleOnClick={handleToggleEstadoMedico}
                mutation={mutation}
              />
            ))
          )}
        </div>

        {/* Paginacion */}
        <Pagination
          currentPage={page}
          totalPages={medicos.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Medicos;
