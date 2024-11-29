import { useQuery } from "@tanstack/react-query";
import { getPostasAdmin } from "../../api/postas";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardPosta from "../../components/cards/CardPosta";

function Postas() {
  const { page, setPage } = usePagination();

  const {
    data: postas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["postas", { page, limit: 3 }],
    queryFn: getPostasAdmin,
    keepPreviousData: true,
  });

  if (isLoading) return <b>Cargando ...</b>;
  if (isError) return <b>Ocurrio un error</b>;

  return (
    <>
      <h1>Postas</h1>

      {/* Renderizado de cards */}
      <div className="container">
        {postas.data.map((posta) => (
          <CardPosta
            key={posta.idposta}
            id={posta.idposta}
            foto={posta.foto}
            nombre={posta.nombre}
            ciudad={posta.ciudad}
            direccion={posta.direccion}
            estado={posta.disponible}
          />
        ))}
      </div>

      {/* Paginacion */}
      <Pagination
        currentPage={page}
        totalPages={postas.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default Postas;
