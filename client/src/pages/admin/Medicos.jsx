import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicosAdmin } from "../../api/medicos";
import { cambiarEstadoMedico } from "../../api/medicos";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardMedico from "../../components/cards/CardMedico";
import SearchBar from "../../components/SearchBar";
import Loading from "../Loading";

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
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <h1 className="mt-4 ms-3">Médicos</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {/* Barra de busqueda */}
            <SearchBar
              onSearch={handleSearch}
              nombre="médico"
              url="/admin/registrar/medico"
            />
          </div>
        </div>
        <div className="row m-3">
          {/* Renderizado de cards */}
          {medicos.data.map((medico) => (
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
          ))}
          {/* Paginacion */}
          <Pagination
            currentPage={page}
            totalPages={medicos.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}

export default Medicos;
