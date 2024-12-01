import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMedico } from "../../api/medicos";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function ConsultoriosMedico() {
  const { idmedico } = useParams();

  // Peticion de datos de medico
  const {
    data: medico,
    isLoading: isMedicoLoading,
    isError: isMedicoError,
  } = useQuery({
    queryKey: ["medico", idmedico],
    queryFn: () => getMedico(idmedico),
  });

  if (isMedicoLoading) return <Loading nombre="Médico ..." />;
  if (isMedicoError)
    return <ErrorPage code={500} message="Ocurrión un error ..." />;

  return (
    <>
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
                <div className="text-center">
                  <a
                    href={`/admin/editar/medico/${medico.idmedico}`}
                    className="card-link btn btn-warning"
                  >
                    {" "}
                    Editar
                  </a>
                  <a
                    href="#"
                    className={`card-link btn ${
                      medico.disponible ? "btn-danger" : "btn-success"
                    }`}
                  >
                    {medico.disponible ? "Deshabilitar" : "Habilitar"}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            {medico?.postas?.length === 0 ? (
              <p>El medico no esta asignado a una posta</p>
            ) : (
              medico?.postas?.map((posta, index) => (
                <div key={index} className="row mt-5">
                  <div className="col-12">
                    <h2 className="mb-3">{posta.nombre_posta}</h2>
                  </div>
                  <div className="row me-3">
                    {posta.consultorios.length === 0 ? (
                      <p>El medico no tiene asignado un consultorio</p>
                    ) : (
                      posta.consultorios.map((consultorio, index) => (
                        <div className="col-4">
                          <div key={index} className="card">
                            <div className="card-body">
                              <p className="card-text">
                                <b>Consultorio: </b>
                                {consultorio.nombre_consultorio}
                              </p>
                              <p className="card-text">
                                <b>Estado: </b>
                                {consultorio.estado
                                  ? "Disponible"
                                  : "No disponible"}
                              </p>
                              <button
                                type="button"
                                className={`btn ${
                                  consultorio.estado
                                    ? "btn-danger"
                                    : "btn-success"
                                }`}
                              >
                                {consultorio.estado
                                  ? "Deshabilitar"
                                  : "Habilitar"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p>{idmedico}</p>
    </>
  );
}

export default ConsultoriosMedico;
