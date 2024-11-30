import { useQuery } from "@tanstack/react-query";
import { getPostasAdmin } from "../../api/postas";
import { useState } from "react";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import CardPosta from "../../components/cards/CardPosta";
import SearchBar from "../../components/SearchBar";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
//import PostaFoto from "../../assets/posta.jpg";

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
    <>
      <div className="container-fluid containerColor vh-100">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <h1 className="m-3">Postas</h1>
            {/* Barra de busqueda */}
            <SearchBar
              onSearch={handleSearch}
              nombre="posta"
              url="/admin/registrar/posta"
            />
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
              />
            ))
          )}
          {/* Paginacion */}
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
