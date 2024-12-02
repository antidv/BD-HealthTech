import { Link, useParams } from "react-router-dom";
import { getCitaMedico } from "../../api/medicos";
import {
  getEnfermedades,
  getMedicamentos,
  getAntecedentesFaltantesPaciente,
} from "../../api/antecedentes";
import { getPerfilPacienteId } from "../../api/paciente";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import CardPaciente from "../../components/cards/CardPaciente";

function GenerarDiagnostico() {
  const { idcita } = useParams();
  // Peticion de la cita
  const {
    data: cita,
    isLoading: isCLoad,
    isError: isCError,
  } = useQuery({
    queryKey: ["cita", idcita],
    queryFn: () => getCitaMedico(idcita),
  });

  // Peticion de perfil paciente
  const {
    data: paciente,
    isLoading: isPacLoad,
    isError: isPacError,
  } = useQuery({
    queryKey: ["paciente", cita?.idpaciente],
    queryFn: () => getPerfilPacienteId(cita?.idpaciente),
    enabled: !!cita,
  });

  // Peticion de Antecedentes faltantes
  const {
    data: antecedentes,
    isLoading: isAntLoad,
    isError: isAntError,
  } = useQuery({
    queryKey: ["antecedentes", cita?.idpaciente],
    queryFn: () => getAntecedentesFaltantesPaciente(cita?.idpaciente),
    enabled: !!cita,
  });

  // Peticion de Enfermedades
  const {
    data: enfermedades,
    isLoading: isEnfLoad,
    isError: isEnfError,
  } = useQuery({
    queryKey: ["enfermedades"],
    queryFn: getEnfermedades,
  });

  // Peticion de Medicamentos
  const {
    data: medicamentos,
    isLoading: isMedLoad,
    isError: isMedError,
  } = useQuery({
    queryKey: ["medicamentos"],
    queryFn: getMedicamentos,
  });

  if (isCLoad || isPacLoad || isAntLoad || isEnfLoad || isMedLoad)
    return <Loading nombre="datos de cita ..." />;
  if (isCError || isPacError || isAntError || isEnfError || isMedError)
    return <ErrorPage code={500} message={"Ocurrió un error"} />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-4 justify-content-center">
            {/* Dato de Paciente */}
            <CardPaciente
              nombre={
                paciente.nombre +
                " " +
                paciente.apellidoP +
                " " +
                paciente.apellidoM
              }
              genero={paciente.genero}
              fecha_nacimiento={paciente.fecha_nacimiento}
              dni={paciente.dni}
              direccion={paciente.direccion}
              ciudad={paciente.ciudad}
            />
          </div>
          <div className="col-8 mb-5">
            <div className="row mt-2 me-5">
              <div className="col-12 mt-5 me-5">
                {/* Datos de la cita */}
                <h2>Datos de la Cita</h2>
                <div className="alert alert-danger" role="alert">
                  <ul className="mb-0">
                    <li>
                      <strong>Fecha:</strong> {cita.fecha}
                    </li>
                    <li>
                      <strong>Motivo:</strong> {cita.motivo}
                    </li>
                    <li>
                      <strong>Consultorio:</strong> {cita.consultorio}
                    </li>
                    <li>
                      <strong>Paciente:</strong>{" "}
                      {cita.paciente_nombre + " " + cita.paciente_apellido}
                    </li>
                  </ul>
                </div>
                <label htmlFor="triaje" className="form-label">
                  Triaje:
                </label>
                <input id="triaje" type="text" className="form-control" />
                <label htmlFor="triaje" className="form-label">
                  Estado de la Cita
                </label>
                <select className="form-select">
                  <option value={"Atendido"}>Atendido</option>
                  <option value={"Ausente"}>Ausente</option>
                </select>
                <h2>Generar diagnóstico</h2>
                {/* <button className="btn btn-primary">Agregar</button> */}
                <div className="row">
                  <div className="col-10 mt-4">
                    <div className="card">
                      <div className="card-body">
                        <form>
                          <div className="row">
                            <div className="col-12">
                              <label
                                htmlFor="Enfermedad"
                                className="form-label mt-2"
                              >
                                Diagnostico
                              </label>
                              <select className="form-select">
                                <option value="">
                                  Seleccione una enfermendad
                                </option>
                                {enfermedades?.map((enf) => (
                                  <option
                                    key={enf.idenfermedad}
                                    value={enf.idenfermedad}
                                  >
                                    {enf.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <label htmlFor="obs">Observaciones:</label>
                            <textarea
                              id="obs"
                              className="form-control"
                            ></textarea>
                            <div className="col-12">
                              <label
                                htmlFor="medicamento"
                                className="form-label mt-2"
                              >
                                Medicamento
                              </label>
                              <select className="form-select">
                                <option value="">
                                  Seleccione un medicamento
                                </option>
                                {medicamentos?.map((med) => (
                                  <option
                                    key={med.idmedicamento}
                                    value={med.idmedicamento}
                                  >
                                    {med.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-12">
                              <label
                                htmlFor="dosis"
                                className="form-label mt-2"
                              >
                                Dosis
                              </label>
                              <input
                                id="dosis"
                                type="text"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2 me-5">
              <div className="col-12 mt-3 me-5">
                <h3>Antecedentes médicos</h3>
              </div>
              <div className="col-12 mt-3 me-5">
                <h4 className="mb-4">Alergias</h4>
                <div className="row">
                  {antecedentes?.alergias_faltantes?.map((alergia) => (
                    <div key={alergia.idalergia} className="col-2 d-flex">
                      <input
                        type="checkbox"
                        id={`alergia-${alergia.idalergia}`}
                        className="me-2 form-check-input"
                      />
                      <label
                        htmlFor={`alergia-${alergia.idalergia}`}
                        className="form-check-label"
                      >
                        {alergia.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 mt-3 me-5">
                <h4 className="mb-4">Enfermedades</h4>
                <div className="row">
                  {antecedentes?.enfermedades_faltantes?.map((enfermedad) => (
                    <div key={enfermedad.idenfermedad} className="col-2 d-flex">
                      <input
                        type="checkbox"
                        id={`enfermedad-${enfermedad.idenfermedad}`}
                        className="me-2 form-check-input"
                      />
                      <label
                        htmlFor={`enfermedad-${enfermedad.idenfermedad}`}
                        className="form-check-label"
                      >
                        {enfermedad.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row mt-2 me-5">
              <div className="col-12 d-flex justify-content-end">
                <Link to={"/medico/citas"} className="btn btn-secondary me-3">
                  Volver
                </Link>
                <button type="button" className="btn btn-primary">
                  Generar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GenerarDiagnostico;
