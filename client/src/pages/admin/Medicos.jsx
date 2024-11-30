import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMedicosAdmin } from "../../api/medicos";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardMedico from "../../components/cards/CardMedico";
import SearchBar from "../../components/SearchBar";

function Medicos() {
  const { page, setPage } = usePagination();
  const [filter, setFilter] = useState("");

  const {
    data: medicos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medicos", { page, limit: 3, search: filter }],
    queryFn: () => getMedicosAdmin({ page, limit: 3, search: filter }),
    keepPreviousData: true,
  });

  const handleSearch = (search) => {
    setFilter(search);
    setPage(1);
  };

  if (isLoading) return <b>Cargando ...</b>;
  if (isError) return <b>Ocurrio un error</b>;

  return (
    <>
      <div className="container-fluid containerColor vh-100">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <h1 className="mt-4 ms-3">Médicos</h1>
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
