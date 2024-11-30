import { useParams } from "react-router-dom";
import { getPosta } from "../../api/postas";
import { useQuery } from "@tanstack/react-query";
import { getConsultoriosPosta } from "../../api/consultorios";
import usePagination from "../../hooks/usePagination";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Pagination from "../../components/Pagination";

function ConsultoriosPosta() {
  const { idposta } = useParams();

  const { page, setPage } = usePagination();

  // Petición de datos para posta
  const {
    data: posta,
    isLoading: isPostaLoading,
    isError: isPostaError,
  } = useQuery({
    queryKey: ["posta", idposta],
    queryFn: () => getPosta(idposta),
  });

  // Petición de consultorios, activada solo cuando `posta` está disponible
  const {
    data: consultorios,
    isLoading: isConsultoriosLoading,
    isError: isConsultoriosError,
  } = useQuery({
    queryKey: ["consultorios", { idposta, page, limit: 6 }],
    queryFn: () => getConsultoriosPosta({ idposta, page, limit: 6 }),
    enabled: !!posta, // Solo activa si `posta` tiene valor
    keepPreviousData: true,
  });

  if (isPostaLoading || isConsultoriosLoading)
    return <Loading nombre="posta y consultorios ..." />;
  if (isPostaError || isConsultoriosError)
    return <ErrorPage code={500} message="Ocurrió un error ..." />;

  return (
    <>
      {/* Posta */}
      <div>
        <h1>{posta.nombre}</h1>
        <img src={posta.foto} alt="posta" width={200} />
        <p>{posta.ciudad}</p>
        <p>{posta.direccion}</p>
        <p>{`Estado: ${posta.disponible ? "Disponible" : "No disponible"}`}</p>
      </div>

      {/* Consultorios */}
      <div>
        <h2>Consultorios</h2>
        {consultorios?.data?.length === 0 ? (
          <p>No hay consultorios disponibles</p>
        ) : (
          consultorios?.data?.map((consultorio) => (
            <div key={consultorio.idconsultorio} className="container">
              <img src={consultorio.consultorio_foto} alt="consultorio" />
              <p>{`Consultorio: ${consultorio.consultorio_nombre}`}</p>
            </div>
          ))
        )}
      </div>
      {/* Paginacion de consultorios */}
      <Pagination
        currentPage={page}
        totalPages={consultorios.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default ConsultoriosPosta;
