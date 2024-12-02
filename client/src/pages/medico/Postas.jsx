import { useQuery } from "@tanstack/react-query";
import { getPostasAdmin } from "../../api/postas";
import { useState } from "react";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardPosta from "../../components/cards/CardPosta";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Postas() {
  const { page, setPage } = usePagination();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const {
    data: postas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["postas", { page, limit: 9, search: filter, city: "" }],
    queryFn: () => getPostasAdmin({ page, limit: 9, search: filter, city: "" }),
    keepPreviousData: true,
  });

  const handleSearch = () => {
    setFilter(search); // Actualiza el filtro con el texto ingresado
    setPage(1); // Reinicia a la primera página
  };

  if (isLoading) return <Loading nombre="postas ..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error ..." />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <h1 className="m-3">Postas</h1>
            {/* Barra de búsqueda */}
            <div className="d-flex m-3">
              <input
                type="text"
                className="form-control w-25"
                placeholder="Buscar por nombre"
                value={search}
                onChange={(e) => setSearch(e.target.value)} // Actualiza `search` con cada tecla
              />
              <button
                className="btn btn-primary ms-3"
                onClick={handleSearch} // Llama a la función directamente
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="row m-3">
          {/* Renderizado de cards */}
          {postas.data.length === 0 ? (
            <p>No hay datos para mostrar</p>
          ) : (
            postas.data.map((posta) => (
              <CardPosta
                key={posta.idposta}
                id={posta.idposta}
                foto={posta.foto}
                nombre={posta.nombre}
                ciudad={posta.ciudad}
                direccion={posta.direccion}
                estado={posta.disponible}
                link={false}
              />
            ))
          )}
          {/* Paginación */}
          <Pagination
            currentPage={page}
            totalPages={postas.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}

export default Postas;
