import { useQuery } from "@tanstack/react-query";
import { getPostasAdmin } from "../../api/postas";
import { useState } from "react";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardPosta from "../../components/cards/CardPosta";
import SearchBar from "../../components/SearchBar";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Postas() {
  const { page, setPage } = usePagination();
  const [filter, setFilter] = useState("");

  const {
    data: postas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["postas", { page, limit: 9, search: filter, city: "" }],
    queryFn: () => getPostasAdmin({ page, limit: 9, search: filter, city: "" }),
    keepPreviousData: true,
  });

  const handleSearch = (search) => {
    setFilter(search);
    setPage(1);
  };

  if (isLoading) return <Loading nombre="postas ..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error ..." />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1">Postas Médicas</h1>
            <p className="text-muted small mb-0">Gestión de centros de salud y postas asociadas</p>
          </div>
        </div>

        {/* Barra de busqueda */}
        <SearchBar
          onSearch={handleSearch}
          nombre="posta"
          url="/admin/registrar/posta"
        />

        {/* Renderizado de cards */}
        <div className="row g-4">
          {postas.data.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-buildings text-muted fs-1 mb-2 d-block"></i>
              <p className="text-muted">No se encontraron postas médicas.</p>
            </div>
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
              />
            ))
          )}
        </div>

        {/* Paginacion */}
        <Pagination
          currentPage={page}
          totalPages={postas.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Postas;
