import CardMedicoVistaM from "../../components/cards/CardMedicoVistaM";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPerfilMedico } from "../../api/medicos";
import { getCitasMedico } from "../../api/citas";
import Pagination from "../../components/Pagination";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import usePagination from "../../hooks/usePagination";

function MedicoPrincipal() {
  const { page, setPage } = usePagination();

  // Peticion del perfil medico
  const {
    data: medico,
    isLoading: isMedLoad,
    isError: isMedError,
  } = useQuery({
    queryKey: ["medico"],
    queryFn: getPerfilMedico,
  });

  // Peticion de citas del medico
  const {
    data: citas,
    isLoading: isCitaLoad,
    isError: isCitaError,
  } = useQuery({
    queryKey: ["citas", { page, limit: 10 }],
    queryFn: () => getCitasMedico({ page, limit: 10 }),
  });

  if (isMedLoad || isCitaLoad)
    return <Loading nombre="perfil médico y citas..." />;
  if (isMedError || isCitaError)
    return <ErrorPage code={500} message={"Ocurrió un error al cargar la información"} />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1280px" }}>
        <div className="row g-4 align-items-start">
          {/* Datos del médico */}
          <div className="col-12 col-lg-4">
            <CardMedicoVistaM
              nombre={
                medico.nombre + " " + medico.apellidoP + " " + medico.apellidoM
              }
              foto={medico.foto}
              especialidad={medico.especialidad}
              dni={medico.dni}
              disponible={medico.disponible}
            />
          </div>

          {/* Tabla de citas asignadas */}
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="fw-bold mb-0">Historial de Citas</h2>
                <p className="text-muted small mb-0">Citas asignadas y atención a pacientes</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden mb-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Paciente</th>
                      <th>Consultorio</th>
                      <th>Posta</th>
                      <th>Estado</th>
                      <th className="text-end pe-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!citas?.data || citas?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <i className="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>
                          No hay citas programadas para atender.
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
                            <td>
                              <span className="fw-semibold">
                                {cita.paciente_nombre + " " + cita.paciente_apellido}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {cita.consultorio}
                              </span>
                            </td>
                            <td>{cita.posta_nombre}</td>
                            <td>
                              <span className={estadoClass}>
                                {cita.estado}
                              </span>
                            </td>
                            <td className="text-end pe-3">
                              <Link
                                to={`/medico/diagnostico/${cita.idcita}`}
                                className={`btn btn-sm ${
                                  cita.estado === "Atendido" || cita.estado === "Ausente"
                                    ? "btn-secondary disabled"
                                    : "btn-warning"
                                }`}
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Atender
                              </Link>
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

export default MedicoPrincipal;
