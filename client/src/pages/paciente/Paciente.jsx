import CardPaciente from "../../components/cards/CardPaciente";
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

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1280px" }}>
        <div className="row g-4 align-items-start">
          {/* Tarjeta de información del paciente */}
          <div className="col-12 col-lg-4">
            <CardPaciente
              nombre={
                paciente.nombre +
                " " +
                paciente.apellidoP +
                " " +
                paciente.apellidoM
              }
              genero={paciente.genero}
              fecha_nacimiento={paciente.fecha_nacimiento}
              dni={paciente.dni}
              direccion={paciente.direccion}
              ciudad={paciente.ciudad}
            />
          </div>

          {/* Tabla de Citas del Paciente */}
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="fw-bold mb-0">Mis Citas Médicas</h2>
                <p className="text-muted small mb-0">Historial y citas programadas</p>
              </div>
              <Link to="/paciente/citas-disponibles" className="btn btn-warning shadow-sm">
                <i className="bi bi-calendar-plus me-1"></i>
                Solicitar Cita
              </Link>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden mb-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Posta</th>
                      <th>Consultorio</th>
                      <th>Médico</th>
                      <th>Estado</th>
                      <th className="text-end pe-3">Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!citas?.data || citas?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <i className="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>
                          No tienes citas registradas.
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
                            <td className="fw-semibold text-dark">
                              <i className="bi bi-calendar2-event me-2 text-primary"></i>
                              {cita.fecha}
                            </td>
                            <td>
                              <span className="small text-muted">{cita.hora_aprox}</span>
                            </td>
                            <td>{cita.posta_nombre}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {cita.consultorio}
                              </span>
                            </td>
                            <td className="small">
                              {cita.medico_nombre + " " + cita.medico_apellido}
                            </td>
                            <td>
                              <span className={estadoClass}>
                                {cita.estado}
                              </span>
                            </td>
                            <td className="text-end pe-3">
                              {cita.estado === "Atendido" ? (
                                <Link
                                  to={`/paciente/citas/${cita.idcita}`}
                                  className="btn btn-sm btn-primary"
                                >
                                  <i className="bi bi-file-earmark-medical me-1"></i>
                                  Ver
                                </Link>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={page}
              totalPages={citas.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paciente;
