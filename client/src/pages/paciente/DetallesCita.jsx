import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCitaPaciente } from "../../api/paciente";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function DetallesCita() {
  const { idcita } = useParams();
  // Petición de la cita
  const {
    data: cita,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cita", idcita],
    queryFn: () => getCitaPaciente(idcita),
  });

  if (isLoading) return <Loading nombre="cita ..." />;
  if (isError) return <ErrorPage code={500} message={"Ocurrió un error"} />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <h2 className="m-3">Detalles de la cita</h2>
            <form>
              <div className="row m-3">
                <div className="col-3 mb-3">
                  <label className="form-label">Fecha:</label>
                  <input type="text" value={cita.fecha} disabled className="form-control"/>
                </div>
                <div className="col-3 mb-3">
                  <label className="form-label">Motivo:</label>
                  <input type="text" value={cita.motivo} disabled className="form-control"/>
                </div>
                <div className="col-3 mb-3">
                  <label className="form-label">Consultorio:</label>
                  <input type="text" value={cita.consultorio} disabled className="form-control"/>
                </div>
                <div className="col-3 mb-3">
                  <label className="form-label">Médico:</label>
                  <input
                    type="text"
                    value={`${cita.medico_nombre} ${cita.medico_apellido}`}
                    disabled className="form-control"
                  />
                </div>
              </div>
              
              <h3 className="m-3">Diagnósticos</h3>
              <div className="row m-3">
                {Object.entries(cita.diagnosticos).map(
                  ([diagnostico, medicamentos], index) => (
                    <div key={index} className="col-4 mb-3">
                      <div className="card">
                        <h4 className="m-3">{diagnostico}</h4>
                        {medicamentos.map((medicamento, idx) => (
                          <div key={idx} style={{ marginBottom: "1em" }} className="card-body">
                            <label className="card-text mb-3">Observacion</label>
                            <input
                              type="text"
                              value={medicamento.observacion}
                              disabled
                              className="form-control"
                            />
                            <label className="card-text mb-3">Medicamento:</label>
                            <input
                              type="text"
                              value={medicamento.nombre_medicamento}
                              disabled
                              className="form-control"
                            />
                            <label className="card-text mt-3">Dosis:</label>
                            <input type="text" value={medicamento.dosis} disabled className="form-control"/>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="row me-3 mt-4">
                <div className="col-12 d-flex justify-content-end">
                  <Link to="/paciente/citas" className="btn btn-secondary me-3">
                    Volver
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      
    </>
  );
}

export default DetallesCita;
