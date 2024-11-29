import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMedicosAdmin } from "../../api/medicos";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardMedico from "../../components/cards/CardMedico";

function Medicos() {
  const { page, setPage } = usePagination();

  const {
    data: medicos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medicos", { page, limit: 3 }],
    queryFn: getMedicosAdmin,
  });

  if (isLoading) return <b>Cargando ...</b>;
  if (isError) return <b>Ocurrio un error</b>;

  return (
    <>
      <h1>Medicos</h1>

      {/* Renderizado de cards */}
      <div className="container">
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
      </div>

      {/* Paginacion */}
      <Pagination
        currentPage={page}
        totalPages={medicos.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default Medicos;
