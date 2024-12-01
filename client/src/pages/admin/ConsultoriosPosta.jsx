import { Link, useParams } from "react-router-dom";
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
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-6 d-flex justify-content-center">
            {/* Posta */}
            <div className="card m-5 cardConsultorioPosta">
              <h2 className="m-3 text-center">{posta.nombre}</h2>
              <div className="d-flex justify-content-center">
                <img src={posta.foto} alt="posta" width={200} />
              </div>
              <div className="card-body">
                <p className="card-text">
                  <b>Ciudad: </b>
                  {posta.ciudad}
                </p>
                <p className="card-text">
                  <b>Dirección: </b>
                  {posta.direccion}
                </p>
                <p>
                  <b>Estado: </b>
                  {`${posta.disponible ? "Disponible" : "No disponible"}`}
                </p>
              </div>
              <div className="card-body text-center">
                <a
                  href={`/admin/editar/posta/${posta.idposta}`}
                  className="card-link btn btn-warning"
                >
                  Editar
                </a>
                <a
                  href="#"
                  className={`card-link btn ${
                    posta.disponible ? "btn-danger" : "btn-success"
                  }`}
                >
                  {posta.disponible ? "Deshabilitar" : "Habilitar"}
                </a>
              </div>
            </div>
          </div>
          <div className="col-6 d-flex flex-column">
            {/* Consultorios */}
            <div className="row mt-5">
              <div className="col-12">
                <h2 className="mb-3">Consultorios</h2>
              </div>
            </div>
            <div className="row me-3">
              {consultorios?.data?.length === 0 ? (
                <p>No hay consultorios disponibles</p>
              ) : (
                consultorios?.data?.map((consultorio) => (
                  <div
                    key={consultorio.idconsultorio}
                    className="col-12 col-md-4 mb-4"
                  >
                    <div
                      className={`card ${
                        consultorio.disponible === 0 ? "cardRed" : "cardGreen"
                      }`}
                    >
                      <div className="d-flex justify-content-center">
                        <img
                          src={consultorio.consultorio_foto}
                          alt="consultorio"
                          className="imageConsultorio mt-3"
                        />
                      </div>
                      <div className="card-body">
                        <p>{`${consultorio.consultorio_nombre}`}</p>
                      </div>
                      <Link
                        to={`/admin/programacion-citas/${consultorio.idconsultorio_posta}`}
                        className={`card-link btn btn-warning ${
                          consultorio.disponible ? "" : "disabled"
                        } `}
                      >
                        Programar cita
                      </Link>
                    </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsultoriosPosta;
