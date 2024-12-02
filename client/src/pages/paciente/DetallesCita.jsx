import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCitaPaciente } from "../../api/paciente";
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
      <div>
        <h1>Detalles de la Cita</h1>
        <form>
          <div>
            <label>Fecha:</label>
            <input type="text" value={cita.fecha} disabled />
          </div>
          <div>
            <label>Motivo:</label>
            <input type="text" value={cita.motivo} disabled />
          </div>
          <div>
            <label>Consultorio:</label>
            <input type="text" value={cita.consultorio} disabled />
          </div>
          <div>
            <label>Médico:</label>
            <input
              type="text"
              value={`${cita.medico_nombre} ${cita.medico_apellido}`}
              disabled
            />
          </div>
          <h2>Diagnósticos:</h2>
          {Object.entries(cita.diagnosticos).map(
            ([diagnostico, medicamentos], index) => (
              <div key={index}>
                <h3>{diagnostico}</h3>
                {medicamentos.map((medicamento, idx) => (
                  <div key={idx} style={{ marginBottom: "1em" }}>
                    <label>Medicamento:</label>
                    <input
                      type="text"
                      value={medicamento.nombre_medicamento}
                      disabled
                    />
                    <label>Dosis:</label>
                    <input type="text" value={medicamento.dosis} disabled />
                  </div>
                ))}
              </div>
            )
          )}
        </form>
      </div>
    </>
  );
}

export default DetallesCita;
