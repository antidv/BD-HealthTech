import { useQuery } from "@tanstack/react-query";
import { getConsultoriosMedicoLog } from "../../api/medicos";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Consultorios() {

  // Petición para obtener consultorios del médico
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
    <div className="container-fluid containerColor">
      <div className="row justify-content-center">
        <div className="col-4 justify-content-center">
          <div className="card m-5 cardConsultorioMedico">
            <h2 className="m-3 text-center">{`${medico.nombre} ${medico.apellidoP}`}</h2>
            <div className="d-flex justify-content-center">
              <img
                src={medico.foto}
                alt="medico"
                className="card-img-top imageCard"
              />
            </div>
            <div className="card-body">
              <p className="card-text">
                <b>Especialidad: </b>
                {medico.especialidad}
              </p>
              <p className="card-text">
                <b>DNI: </b>
                {medico.dni}
              </p>
              <p>
                <b>Estado: </b>
                {`${medico.disponible ? "Disponible" : "No disponible"}`}
              </p>
            </div>
          </div>
        </div>
        <div className="col-8">
          <h1>Postas de trabajo</h1>
          {medico?.postas?.length > 0 ? (
            medico?.postas?.map((posta, index) => (
              <div key={index} className="row mt-5">
                <div className="col-12">
                  <h2 className="mb-3">{posta.nombre_posta}</h2>
                </div>
                <div className="row me-3">
                  {posta?.consultorios?.length > 0 ? (
                    posta?.consultorios?.map((consultorio, index) => (
                      <div key={index} className="col-4">
                        <div className="card">
                          <div className="card-body">
                            <p className="card-text">
                              <b>Consultorio: </b>
                              {consultorio.nombre_consultorio}
                            </p>
                            <p className="card-text">
                              <b>Estado: </b>
                              {consultorio.estado ? "Disponible" : "No disponible"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay consultorios asignados en esta posta.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No hay postas asignadas al médico.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Consultorios;
