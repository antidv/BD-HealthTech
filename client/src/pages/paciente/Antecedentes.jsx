import { useQuery } from "@tanstack/react-query";
import { getAntecedentesPaciente } from "../../api/paciente";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Antecedentes() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["antecedentes"],
    queryFn: () => getAntecedentesPaciente(),
  });

  if (isLoading) return <Loading nombre="antecedentes..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error al cargar antecedentes" />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1">Antecedentes Médicos</h1>
            <p className="text-muted small mb-0">Información clínica sobre enfermedades y alergias registradas</p>
          </div>
          <Link to="/paciente/citas" className="btn btn-secondary shadow-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a citas
          </Link>
        </div>

        {data?.antecedentes?.length > 0 ? (
          data.antecedentes.map((antecedente) => (
            <div key={antecedente.idantecedentes} className="row g-4">
              {/* Card Enfermedades */}
              <div className="col-12 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-white py-3 d-flex align-items-center gap-2 border-bottom">
                    <i className="bi bi-heart-pulse text-danger fs-5"></i>
                    <h5 className="mb-0 fw-bold">Enfermedades</h5>
                  </div>
                  <div className="card-body p-3">
                    {antecedente?.enfermedades?.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {antecedente.enfermedades.map((enfermedad, index) => (
                          <li key={index} className="list-group-item px-2 py-3 d-flex align-items-center gap-2">
                            <i className="bi bi-check2-circle text-primary"></i>
                            <span className="fw-medium">{enfermedad}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted text-center py-4 mb-0">No hay enfermedades registradas.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Alergias */}
              <div className="col-12 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-white py-3 d-flex align-items-center gap-2 border-bottom">
                    <i className="bi bi-shield-exclamation text-warning fs-5"></i>
                    <h5 className="mb-0 fw-bold">Alergias</h5>
                  </div>
                  <div className="card-body p-3">
                    {antecedente?.alergias?.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {antecedente.alergias.map((alergia, index) => (
                          <li key={index} className="list-group-item px-2 py-3 d-flex align-items-center gap-2">
                            <i className="bi bi-exclamation-circle text-warning"></i>
                            <span className="fw-medium">{alergia}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted text-center py-4 mb-0">No hay alergias registradas.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card border-0 shadow-sm text-center py-5">
            <i className="bi bi-folder-x fs-1 text-muted d-block mb-2"></i>
            <p className="text-muted mb-0">No hay antecedentes disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Antecedentes;
