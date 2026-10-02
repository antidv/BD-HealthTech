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
    enabled: !!posta,
    keepPreviousData: true,
  });

  if (isPostaLoading || isConsultoriosLoading)
    return <Loading nombre="posta y consultorios ..." />;
  if (isPostaError || isConsultoriosError)
    return <ErrorPage code={500} message="Ocurrió un error al cargar la posta." />;

  return (
    <div className="container py-4" style={{ maxWidth: "1280px" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/postas" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Postas
          </Link>
          <h2 className="mb-0 fw-bold">{posta.nombre}</h2>
        </div>
      </div>

      {/* Banner Superior: Información de la Posta */}
      <div className="card shadow-sm border-0 mb-4 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
              <div className="avatar-frame flex-shrink-0" style={{ width: "95px", height: "95px" }}>
                <img
                  src={posta.foto || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300"}
                  alt={posta.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center justify-content-sm-start mb-1">
                  <h3 className="fw-bold mb-0 text-dark">{posta.nombre}</h3>
                  <span className={`badge ${posta.disponible ? "badge-active" : "badge-inactive"}`}>
                    <i className={`bi bi-${posta.disponible ? "check-circle" : "x-circle"} me-1`}></i>
                    {posta.disponible ? "Posta Operativa" : "Posta No Operativa"}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3 flex-wrap text-muted small mt-2 justify-content-center justify-content-sm-start">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 fw-semibold">
                    <i className="bi bi-geo-alt me-1"></i>
                    {posta.ciudad}
                  </span>
                  <span>
                    <i className="bi bi-pin-map me-1 text-primary"></i>
                    Dirección: <strong>{posta.direccion}</strong>
                  </span>
                  {posta.telefono && (
                    <span>
                      <i className="bi bi-telephone me-1 text-primary"></i>
                      Tel: <strong>{posta.telefono}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 flex-shrink-0">
              <Link
                to={`/admin/editar/posta/${posta.idposta}`}
                className="btn btn-warning px-4 shadow-sm fw-bold"
              >
                <i className="bi bi-pencil-square me-1"></i> Editar Posta y Consultorios
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Consultorios Asociados en Grid Completo */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h4 className="fw-bold mb-0 text-primary">
              <i className="bi bi-door-open me-2"></i>Consultorios Disponibles
            </h4>
            <p className="text-muted small mb-0">Seleccione un consultorio para programar jornadas de citas médicas</p>
          </div>
          <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
            Total: {consultorios?.totalRecords || consultorios?.data?.length || 0} Consultorios
          </span>
        </div>
        <div className="card-body p-4">
          {consultorios?.data?.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
              <h5>No hay consultorios registrados para esta posta médica</h5>
              <p className="small mb-0">Haga clic en "Editar Posta" para agregar consultorios.</p>
            </div>
          ) : (
            <div className="row g-4">
              {consultorios?.data?.map((consultorio) => (
                <div
                  key={consultorio.idconsultorio_posta || consultorio.idconsultorio}
                  className="col-12 col-md-6 col-lg-4"
                >
                  <div className="card h-100 border-0 shadow-sm hover-lift bg-white">
                    <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                      <div>
                        <div
                          className="avatar-frame mx-auto mb-3"
                          style={{ width: "75px", height: "75px" }}
                        >
                          <img
                            src={
                              consultorio.consultorio_foto ||
                              "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300"
                            }
                            alt={consultorio.consultorio_nombre}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>

                        <h5 className="fw-bold mb-1 text-truncate">
                          {consultorio.consultorio_nombre}
                        </h5>

                        <div className="my-2">
                          <span
                            className={`badge ${
                              consultorio.disponible
                                ? "badge-active"
                                : "badge-inactive"
                            }`}
                          >
                            {consultorio.disponible ? "Habilitado" : "No disponible"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top border-light">
                        <Link
                          to={`/admin/programacion-citas/${consultorio.idconsultorio_posta}`}
                          className={`btn btn-warning w-100 fw-bold ${
                            consultorio.disponible ? "" : "disabled"
                          }`}
                        >
                          <i className="bi bi-calendar-plus me-1"></i> Programar Citas
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {consultorios?.totalPages > 1 && (
            <div className="mt-4 pt-3 border-top border-light">
              <Pagination
                currentPage={page}
                totalPages={consultorios.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultoriosPosta;
