import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCitaPaciente } from "../../api/paciente";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function DetallesCita() {
  const { idcita } = useParams();

  const {
    data: cita,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cita", idcita],
    queryFn: () => getCitaPaciente(idcita),
  });

  if (isLoading) return <Loading nombre="detalles de la cita..." />;
  if (isError) return <ErrorPage code={500} message={"Ocurrió un error al cargar la cita"} />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1">Detalles de la Cita</h1>
            <p className="text-muted small mb-0">Resumen clínico y prescripción médica</p>
          </div>
          <Link to="/paciente/citas" className="btn btn-secondary shadow-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a citas
          </Link>
        </div>

        {/* Información general de la cita */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-primary"></i>
              Información General
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small">Fecha</label>
                <div className="fw-semibold">{cita.fecha}</div>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small">Motivo</label>
                <div className="fw-semibold">{cita.motivo}</div>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small">Consultorio</label>
                <div>
                  <span className="badge bg-light text-dark border">{cita.consultorio}</span>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label text-muted small">Médico tratante</label>
                <div className="fw-semibold">{`${cita.medico_nombre} ${cita.medico_apellido}`}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnósticos y Recetas */}
        <div className="mb-3">
          <h3 className="fw-bold fs-4 mb-3">Diagnósticos y Tratamientos</h3>
          <div className="row g-4">
            {cita.diagnosticos && Object.keys(cita.diagnosticos).length > 0 ? (
              Object.entries(cita.diagnosticos).map(([diagnostico, medicamentos], index) => (
                <div key={index} className="col-12 col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-light py-3 border-bottom">
                      <h5 className="card-title fs-6 mb-0 text-primary fw-bold">
                        <i className="bi bi-file-medical me-2"></i>
                        {diagnostico}
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      {medicamentos.map((med, idx) => (
                        <div key={idx} className="mb-3 pb-3 border-bottom last-border-0">
                          <div className="mb-2">
                            <span className="text-muted small d-block">Observación:</span>
                            <span className="fw-medium">{med.observacion}</span>
                          </div>
                          <div className="mb-2">
                            <span className="text-muted small d-block">Medicamento:</span>
                            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">
                              {med.nombre_medicamento}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted small d-block">Dosis indicada:</span>
                            <span className="fw-semibold text-dark">{med.dosis}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="card border-0 shadow-sm text-center py-4 text-muted">
                  No se registraron recetas específicas.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallesCita;
