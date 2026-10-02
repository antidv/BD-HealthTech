import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedico } from "../../api/medicos";
import { toggleMedicoConsultorioPosta } from "../../api/medicos";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function ConsultoriosMedico() {
  const { idmedico } = useParams();
  const queryClient = useQueryClient();

  // Peticion de datos de medico
  const {
    data: medico,
    isLoading: isMedicoLoading,
    isError: isMedicoError,
  } = useQuery({
    queryKey: ["medico", idmedico],
    queryFn: () => getMedico(idmedico),
  });

  // Mutacion para habilitar - deshabilitar conmedposta
  const mutation = useMutation({
    mutationKey: ["toggleMedicoConsultorioPosta"],
    mutationFn: (id) => toggleMedicoConsultorioPosta(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["medico", idmedico]);
    },
  });

  const handleToggleConsultorio = (id) => {
    mutation.mutate(id);
  };

  if (isMedicoLoading) return <Loading nombre="médico y consultorios..." />;
  if (isMedicoError)
    return <ErrorPage code={500} message="Ocurrió un error al cargar la información del médico." />;

  const nombreCompleto = `${medico?.nombre || ""} ${medico?.apellidoP || ""} ${medico?.apellidoM || ""}`.trim();

  return (
    <div className="container py-4" style={{ maxWidth: "1280px" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/medicos" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Médicos
          </Link>
          <h2 className="mb-0 fw-bold">Perfil del Médico y Asignaciones</h2>
        </div>
      </div>

      {/* Banner Superior: Perfil del Médico */}
      <div className="card shadow-sm border-0 mb-4 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
              <div className="avatar-frame flex-shrink-0" style={{ width: "95px", height: "95px" }}>
                <img
                  src={medico.foto || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300"}
                  alt={nombreCompleto}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center justify-content-sm-start mb-1">
                  <h3 className="fw-bold mb-0 text-dark">{nombreCompleto}</h3>
                  <span className={`badge ${medico.disponible ? "badge-active" : "badge-inactive"}`}>
                    <i className={`bi bi-${medico.disponible ? "check-circle" : "x-circle"} me-1`}></i>
                    {medico.disponible ? "Médico Activo" : "Médico Inactivo"}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3 flex-wrap text-muted small mt-2 justify-content-center justify-content-sm-start">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 fw-semibold">
                    <i className="bi bi-award me-1"></i>
                    {medico.especialidad}
                  </span>
                  <span>
                    <i className="bi bi-card-text me-1 text-primary"></i>
                    DNI: <strong>{medico.dni}</strong>
                  </span>
                  {medico.correo && (
                    <span>
                      <i className="bi bi-envelope me-1 text-primary"></i>
                      {medico.correo}
                    </span>
                  )}
                  <span>
                    <i className="bi bi-hospital me-1 text-primary"></i>
                    Postas asignadas: <strong>{medico?.postas?.length || 0}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 flex-shrink-0">
              <Link
                to={`/admin/editar/medico/${medico.idmedico}`}
                className="btn btn-warning px-4 shadow-sm fw-bold"
              >
                <i className="bi bi-pencil-square me-1"></i> Editar Información
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Lista Completa de Postas y Consultorios Asignados */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-bold mb-0 text-primary">
            <i className="bi bi-hospital me-2"></i>Postas y Consultorios Asignados
          </h4>
        </div>

        {medico?.postas?.length === 0 ? (
          <div className="card shadow-sm p-5 text-center text-muted border-0">
            <i className="bi bi-hospital fs-1 mb-3 text-secondary"></i>
            <h5>El médico no tiene asignaciones a postas médicas</h5>
            <p className="small mb-0">Haga clic en "Editar Información" arriba para asociarlo a consultorios.</p>
          </div>
        ) : (
          medico?.postas?.map((posta, index) => (
            <div key={index} className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>{posta.nombre_posta}
                </h5>
                <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1">
                  {posta.consultorios?.length || 0} Consultorios en esta posta
                </span>
              </div>
              <div className="card-body p-4">
                {posta.consultorios?.length === 0 ? (
                  <p className="text-muted mb-0">No tiene consultorios asignados en esta posta.</p>
                ) : (
                  <div className="row g-3">
                    {posta.consultorios.map((consultorio, cIndex) => (
                      <div key={cIndex} className="col-12 col-md-6 col-lg-4">
                        <div className={`p-4 rounded-3 border h-100 d-flex flex-column justify-content-between ${consultorio.estado ? "bg-white shadow-sm" : "bg-light text-muted"}`}>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="fw-bold mb-1 text-dark">
                                <i className="bi bi-door-open me-2 text-primary"></i>
                                {consultorio.nombre_consultorio}
                              </h6>
                              <span className={`badge ${consultorio.estado ? "badge-active" : "badge-inactive"}`}>
                                {consultorio.estado ? "Habilitado" : "Deshabilitado"}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`btn btn-sm w-100 ${
                              consultorio.estado
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            onClick={() =>
                              handleToggleConsultorio(
                                consultorio.idmedconposta
                              )
                            }
                            disabled={mutation.isPending}
                          >
                            <i className={`bi bi-${consultorio.estado ? "slash-circle" : "check-circle"} me-1`}></i>
                            {mutation.isPending
                              ? "Actualizando..."
                              : consultorio.estado
                              ? "Deshabilitar"
                              : "Habilitar"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConsultoriosMedico;
