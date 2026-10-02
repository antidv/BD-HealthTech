import { useQuery } from "@tanstack/react-query";
import { getConsultoriosMedicoLog } from "../../api/medicos";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Consultorios() {
  const {
    data: medico,
    isLoading: isMedicoLoading,
    isError: isMedicoError,
  } = useQuery({
    queryKey: ["medico_consultorios"],
    queryFn: getConsultoriosMedicoLog,
  });

  if (isMedicoLoading) {
    return <Loading nombre="datos del médico..." />;
  }

  if (isMedicoError) {
    return <ErrorPage code={500} message="Ocurrió un error al cargar los datos." />;
  }

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1280px" }}>
        <div className="row g-4 align-items-start">
          {/* Tarjeta del médico */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="imageCardWrapper text-center pt-4 position-relative">
                <img
                  src={medico.foto}
                  alt="medico"
                  className="imageCard rounded-circle shadow-sm"
                  style={{ width: "110px", height: "110px" }}
                />
                <span
                  className={`position-absolute top-0 end-0 m-3 badge-status ${
                    medico.disponible ? "habilitado" : "deshabilitado"
                  }`}
                >
                  <i
                    className={`bi ${
                      medico.disponible ? "bi-check-circle-fill" : "bi-x-circle-fill"
                    }`}
                  ></i>
                  {medico.disponible ? "Disponible" : "No disponible"}
                </span>
              </div>
              <div className="card-body p-4">
                <h4 className="card-title text-center fw-bold mb-3">
                  {`${medico.nombre} ${medico.apellidoP}`}
                </h4>

                <div className="d-flex flex-column gap-2 text-secondary">
                  <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="fw-semibold text-dark">
                      <i className="bi bi-award me-1 text-primary"></i> Especialidad
                    </span>
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-1 rounded-pill">
                      {medico.especialidad}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between pt-1">
                    <span className="fw-semibold text-dark">
                      <i className="bi bi-card-heading me-1 text-primary"></i> DNI
                    </span>
                    <span>{medico.dni}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Centros de Salud y Consultorios Asignados */}
          <div className="col-12 col-lg-8">
            <div className="mb-4">
              <h2 className="fw-bold mb-1">Centros de Salud Asignados</h2>
              <p className="text-muted small mb-0">Postas médicas y consultorios donde prestas servicio</p>
            </div>

            {medico?.postas?.length > 0 ? (
              medico.postas.map((posta, index) => (
                <div key={index} className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
                    <i className="bi bi-buildings text-primary fs-5"></i>
                    <h5 className="mb-0 fw-bold">{posta.nombre_posta}</h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      {posta?.consultorios?.length > 0 ? (
                        posta.consultorios.map((consultorio, idx) => (
                          <div key={idx} className="col-12 col-md-6">
                            <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                              <div>
                                <span className="text-muted small d-block">Consultorio</span>
                                <span className="fw-bold text-dark">{consultorio.nombre_consultorio}</span>
                              </div>
                              <span
                                className={`badge-status ${
                                  consultorio.estado ? "habilitado" : "deshabilitado"
                                }`}
                              >
                                {consultorio.estado ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted mb-0">No hay consultorios asignados en esta posta.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card border-0 shadow-sm text-center py-5 text-muted">
                <i className="bi bi-buildings fs-1 d-block mb-2 text-secondary"></i>
                No hay postas asignadas actualmente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Consultorios;
