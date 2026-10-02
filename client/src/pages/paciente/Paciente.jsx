import FotoPaciente from "../../assets/paciente.png";
import { Link } from "react-router-dom";
import { getPacienteLogeado } from "../../api/paciente";
import { getCitasPacienteLogeado } from "../../api/citas";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";

function Paciente() {
  const { page, setPage } = usePagination();

  // Peticion de datos de paciente
  const {
    data: paciente,
    isLoading: isPLoad,
    isError: isPError,
  } = useQuery({
    queryKey: ["paciente"],
    queryFn: getPacienteLogeado,
  });

  // Peticion de citas de paciente
  const {
    data: citas,
    isLoading: isCitaLoad,
    isError: isCitaError,
  } = useQuery({
    queryKey: ["citas", { page, limit: 10 }],
    queryFn: () => getCitasPacienteLogeado({ page, limit: 10 }),
  });

  if (isPLoad || isCitaLoad)
    return <Loading nombre="perfil de paciente y citas..." />;
  if (isPError || isCitaError)
    return <ErrorPage code={500} message={"Ocurrió un error al cargar la información"} />;

  const nombreCompleto = `${paciente?.nombre || ""} ${paciente?.apellidoP || ""} ${paciente?.apellidoM || ""}`.trim();

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1280px" }}>
        
        {/* Banner Superior: Perfil del Paciente */}
        <div className="card shadow-sm border-0 mb-4 overflow-hidden">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
                <div className="avatar-frame flex-shrink-0" style={{ width: "95px", height: "95px" }}>
                  <img
                    src={FotoPaciente}
                    alt={nombreCompleto}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h3 className="fw-bold mb-1 text-dark">{nombreCompleto}</h3>
                  <div className="d-flex align-items-center gap-3 flex-wrap text-muted small mt-2 justify-content-center justify-content-sm-start">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 fw-semibold">
                      <i className="bi bi-card-heading me-1"></i>
                      DNI: {paciente.dni}
                    </span>
                    <span>
                      <i className="bi bi-gender-ambiguous me-1 text-primary"></i>
                      Género: <strong>{paciente.genero}</strong>
                    </span>
                    <span>
                      <i className="bi bi-cake2 me-1 text-primary"></i>
                      F. Nacimiento: <strong>{paciente.fecha_nacimiento}</strong>
                    </span>
                    <span>
                      <i className="bi bi-geo-alt me-1 text-primary"></i>
                      {paciente.ciudad}
                    </span>
                    {paciente.direccion && (
                      <span className="text-truncate" style={{ maxWidth: "250px" }}>
                        <i className="bi bi-pin-map me-1 text-primary"></i>
                        {paciente.direccion}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción rápida */}
              <div className="d-flex gap-2 flex-shrink-0">
                <Link to="/paciente/antecedentes" className="btn btn-outline-primary px-3 shadow-sm">
                  <i className="bi bi-clipboard-pulse me-1"></i> Antecedentes
                </Link>
                <Link to="/paciente/citas-disponibles" className="btn btn-warning px-3 fw-bold shadow-sm">
                  <i className="bi bi-calendar-plus me-1"></i> Solicitar Cita
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Inferior: Tabla Completa de Citas Médicas */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0 text-primary">
                <i className="bi bi-calendar-check me-2"></i>Mis Citas Médicas
              </h4>
              <p className="text-muted small mb-0">Historial completo y citas programadas</p>
            </div>
            <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
              Total: {citas?.totalRecords || citas?.data?.length || 0} Citas
            </span>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Fecha</th>
                    <th>Hora Aprox.</th>
                    <th>Posta Médica</th>
                    <th>Consultorio</th>
                    <th>Médico</th>
                    <th>Estado</th>
                    <th className="text-end pe-4">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {!citas?.data || citas?.data?.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-x fs-1 d-block mb-2 text-secondary"></i>
                        <h5>No tienes citas médicas registradas</h5>
                        <p className="small mb-0">Puedes solicitar una nueva cita médica usando el botón superior.</p>
                      </td>
                    </tr>
                  ) : (
                    citas.data.map((cita) => {
                      const estadoClass =
                        cita.estado === "Atendido"
                          ? "badge-status atendido"
                          : cita.estado === "En espera"
                          ? "badge-status espera"
                          : "badge-status ausente";

                      return (
                        <tr key={cita.idcita}>
                          <td className="ps-4 fw-semibold text-dark">
                            <i className="bi bi-calendar2-event me-2 text-primary"></i>
                            {cita.fecha}
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              <i className="bi bi-clock me-1 text-primary"></i>
                              {cita.hora_aprox || "Programada"}
                            </span>
                          </td>
                          <td>
                            <i className="bi bi-hospital me-1 text-muted"></i>
                            {cita.posta_nombre}
                          </td>
                          <td>
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              <i className="bi bi-door-open me-1"></i>
                              {cita.consultorio}
                            </span>
                          </td>
                          <td className="fw-semibold">
                            {cita.medico_nombre + " " + cita.medico_apellido}
                          </td>
                          <td>
                            <span className={estadoClass}>
                              <i className={`bi bi-${cita.estado === "Atendido" ? "check2-all" : cita.estado === "En espera" ? "hourglass-split" : "x-circle"} me-1`}></i>
                              {cita.estado}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            {cita.estado === "Atendido" ? (
                              <Link
                                to={`/paciente/citas/${cita.idcita}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="bi bi-file-earmark-medical me-1"></i>
                                Ver Diagnóstico
                              </Link>
                            ) : (
                              <span className="text-muted small">Pendiente</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {citas?.totalPages > 1 && (
              <div className="p-3 border-top border-light">
                <Pagination
                  currentPage={page}
                  totalPages={citas.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paciente;
