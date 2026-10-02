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
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/medicos" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Médicos
          </Link>
          <h2 className="mb-0 fw-bold">Consultorios y Asignaciones</h2>
        </div>
        <span className={`badge ${medico?.disponible ? "badge-active" : "badge-inactive"} px-3 py-2 fs-6`}>
          <i className={`bi bi-${medico?.disponible ? "check-circle" : "x-circle"} me-1`}></i>
          {medico?.disponible ? "Médico Activo" : "Médico Inactivo"}
        </span>
      </div>

      <div className="row g-4">
        {/* Perfil del médico */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
            <div className="card-body text-center p-4">
              <div className="avatar-frame mx-auto mb-3" style={{ width: "110px", height: "110px" }}>
                <img
                  src={medico.foto || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300"}
                  alt={nombreCompleto}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h4 className="fw-bold mb-1">{nombreCompleto}</h4>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-3">
                <i className="bi bi-award me-1"></i>
                {medico.especialidad}
              </span>

              <hr className="my-3 opacity-25" />

              <div className="text-start mb-4">
                <div className="d-flex justify-content-between py-2 border-bottom border-light">
                  <span className="text-muted"><i className="bi bi-card-text me-2"></i>DNI</span>
                  <span className="fw-semibold">{medico.dni}</span>
                </div>
                {medico.correo && (
                  <div className="d-flex justify-content-between py-2 border-bottom border-light">
                    <span className="text-muted"><i className="bi bi-envelope me-2"></i>Correo</span>
                    <span className="fw-semibold text-truncate" style={{ maxWidth: "160px" }}>{medico.correo}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted"><i className="bi bi-activity me-2"></i>Estado</span>
                  <span className={`fw-semibold ${medico.disponible ? "text-success" : "text-danger"}`}>
                    {medico.disponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Link
                  to={`/admin/editar/medico/${medico.idmedico}`}
                  className="btn btn-warning"
                >
                  <i className="bi bi-pencil-square me-1"></i> Editar Información
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de postas y consultorios */}
        <div className="col-12 col-lg-8">
          {medico?.postas?.length === 0 ? (
            <div className="card shadow-sm p-5 text-center text-muted">
              <i className="bi bi-hospital fs-1 mb-3 text-secondary"></i>
              <h5>El médico no tiene asignaciones a postas médicas.</h5>
              <p className="small mb-0">Puede editar el perfil del médico para asignar consultorios.</p>
            </div>
          ) : (
            medico?.postas?.map((posta, index) => (
              <div key={index} className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0 d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0 text-primary">
                    <i className="bi bi-hospital me-2"></i>{posta.nombre_posta}
                  </h5>
                  <span className="badge bg-secondary bg-opacity-10 text-secondary">
                    {posta.consultorios?.length || 0} Consultorios
                  </span>
                </div>
                <div className="card-body p-4">
                  {posta.consultorios?.length === 0 ? (
                    <p className="text-muted mb-0">No tiene consultorios asignados en esta posta.</p>
                  ) : (
                    <div className="row g-3">
                      {posta.consultorios.map((consultorio, cIndex) => (
                        <div key={cIndex} className="col-12 col-md-6">
                          <div className={`p-3 rounded-3 border ${consultorio.estado ? "bg-white" : "bg-light text-muted"}`}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="fw-bold mb-1">
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
    </div>
  );
}

export default ConsultoriosMedico;
