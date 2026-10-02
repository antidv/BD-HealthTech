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
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/postas" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Postas
          </Link>
          <h2 className="mb-0 fw-bold">{posta.nombre}</h2>
        </div>
        <span className={`badge ${posta.disponible ? "badge-active" : "badge-inactive"} px-3 py-2 fs-6`}>
          <i className={`bi bi-${posta.disponible ? "check-circle" : "x-circle"} me-1`}></i>
          {posta.disponible ? "Posta Operativa" : "Posta No Operativa"}
        </span>
      </div>

      <div className="row g-4">
        {/* Tarjeta de la Posta */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
            <div className="card-body text-center p-4">
              <div className="avatar-frame mx-auto mb-3" style={{ width: "110px", height: "110px" }}>
                <img
                  src={posta.foto || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300"}
                  alt={posta.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h4 className="fw-bold mb-1">{posta.nombre}</h4>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-3">
                <i className="bi bi-geo-alt me-1"></i>
                {posta.ciudad}
              </span>

              <hr className="my-3 opacity-25" />

              <div className="text-start mb-4">
                <div className="d-flex justify-content-between py-2 border-bottom border-light">
                  <span className="text-muted"><i className="bi bi-geo me-2"></i>Dirección</span>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: "160px" }}>{posta.direccion}</span>
                </div>
                {posta.telefono && (
                  <div className="d-flex justify-content-between py-2 border-bottom border-light">
                    <span className="text-muted"><i className="bi bi-telephone me-2"></i>Teléfono</span>
                    <span className="fw-semibold">{posta.telefono}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted"><i className="bi bi-activity me-2"></i>Estado</span>
                  <span className={`fw-semibold ${posta.disponible ? "text-success" : "text-danger"}`}>
                    {posta.disponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Link
                  to={`/admin/editar/posta/${posta.idposta}`}
                  className="btn btn-warning"
                >
                  <i className="bi bi-pencil-square me-1"></i> Editar Posta y Consultorios
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Consultorios de la Posta */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex align-items-center justify-content-between">
              <h5 className="fw-bold mb-0 text-primary">
                <i className="bi bi-door-open me-2"></i>Consultorios Asociados
              </h5>
              <span className="badge bg-secondary bg-opacity-10 text-secondary">
                Total: {consultorios?.totalRecords || consultorios?.data?.length || 0}
              </span>
            </div>
            <div className="card-body p-4">
              {consultorios?.data?.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  <p>No hay consultorios registrados para esta posta médica.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {consultorios?.data?.map((consultorio) => (
                    <div
                      key={consultorio.idconsultorio_posta || consultorio.idconsultorio}
                      className="col-12 col-md-6"
                    >
                      <div className="card h-100 border-0 shadow-sm hover-lift">
                        <div className="card-body p-4 text-center">
                          <div
                            className="avatar-frame mx-auto mb-3"
                            style={{ width: "70px", height: "70px" }}
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

                          <h6 className="fw-bold mb-1 text-truncate">
                            {consultorio.consultorio_nombre}
                          </h6>

                          <div className="my-2">
                            <span
                              className={`badge ${
                                consultorio.disponible
                                  ? "badge-active"
                                  : "badge-inactive"
                              }`}
                            >
                              {consultorio.disponible ? "Disponible" : "No disponible"}
                            </span>
                          </div>

                          <div className="mt-3">
                            <Link
                              to={`/admin/programacion-citas/${consultorio.idconsultorio_posta}`}
                              className={`btn btn-sm btn-warning w-100 ${
                                consultorio.disponible ? "" : "disabled"
                              }`}
                            >
                              <i className="bi bi-calendar-plus me-1"></i> Programar Cita
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
                <div className="mt-4">
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
      </div>
    </div>
  );
}

export default ConsultoriosPosta;
