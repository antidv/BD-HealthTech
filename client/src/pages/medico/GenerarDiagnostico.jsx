import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { getCitaMedico } from "../../api/medicos";
import {
  getEnfermedades,
  getMedicamentos,
  getAntecedentesFaltantesPaciente,
} from "../../api/antecedentes";
import { updateCitaMedico, createDiagnosticoCita } from "../../api/citas";
import { getPerfilPacienteId } from "../../api/paciente";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import CardPaciente from "../../components/cards/CardPaciente";

function GenerarDiagnostico() {
  const { idcita } = useParams();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      triaje: "-",
      estado: "",
      idenfermedad: "",
      observacion: "",
      idmedicamento: "",
      dosis: "",
    },
  });

  const estado = watch("estado");

  // Navegacion
  const navigate = useNavigate();

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

  // Mutaciones
  const mutationCita = useMutation({
    mutationKey: ["actualizar-cita"],
    mutationFn: ({ idcita, data }) => updateCitaMedico(idcita, data),
  });
  const mutationDiagnostico = useMutation({
    mutationFn: ({ idcita, data }) => createDiagnosticoCita(idcita, data),
  });

  // Manejo del envio del formulario
  const onSubmit = (data) => {
    const { triaje, estado, idenfermedad, observacion, idmedicamento, dosis } =
      data;

    console.log("Datos recibidos: ", data);

    // Preparar datos de cita
    const citaData = { triaje, estado };

    // Enviar datos a la cita
    mutationCita.mutate(
      { idcita, data: citaData },
      {
        onSuccess: (response) => {
          alert("Cita actualizada con exito");
          navigate(`/medico/citas`);
          console.log("Cita actualizada: ", response);
        },
        onError: (error) => {
          console.error("Error al actualizar la cita: ", error);
        },
      }
    );

    // Enviar datos del diagnóstico solo si el estado es "Atendido"
    if (estado === "Atendido") {
      const diagnosticoData = {
        idenfermedad,
        observacion,
        idmedicamento,
        dosis,
      };

      mutationDiagnostico.mutate(
        { idcita, data: diagnosticoData },
        {
          onSuccess: (response) => {
            console.log("Diagnóstico creado: ", response);
          },
          onError: (error) => {
            console.error("Error al crear el diagnóstico: ", error);
          },
        }
      );
    }
  };

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
                <h2>Generar diagnóstico</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset
                    disabled={
                      mutationCita.isPending || mutationDiagnostico.isPending
                    }
                  >
                    {/* Triaje y estado de la cita */}
                    {/* Triaje */}
                    <label htmlFor="triaje" className="form-label">
                      Triaje:
                    </label>
                    <input
                      id="triaje"
                      type="text"
                      className={`form-control ${
                        errors.triaje ? "is-invalid" : ""
                      }`}
                      {...register("triaje", {
                        required: "El triaje es obligatorio",
                      })}
                    />
                    {errors.triaje && (
                      <p className="invalid-feedback">
                        {errors.triaje.message}
                      </p>
                    )}

                    {/* Estado */}
                    <label htmlFor="estado" className="form-label">
                      Estado de la Cita:
                    </label>
                    <select
                      id="estado"
                      className={`form-select ${
                        errors.estado ? "is-invalid" : ""
                      }`}
                      {...register("estado", {
                        required: "El estado es obligatorio",
                      })}
                    >
                      <option value="">Seleccione el estado</option>
                      <option value="Atendido">Atendido</option>
                      <option value="Ausente">Ausente</option>
                    </select>
                    {errors.estado && (
                      <p className="invalid-feedback">
                        {errors.estado.message}
                      </p>
                    )}
                    {/* Diagnóstico */}
                    {estado !== "Ausente" && (
                      <>
                        <label
                          htmlFor="idenfermedad"
                          className="form-label mt-2"
                        >
                          Diagnóstico:
                        </label>
                        <select
                          id="idenfermedad"
                          className={`form-select ${
                            errors.idenfermedad ? "is-invalid" : ""
                          }`}
                          {...register("idenfermedad", {
                            required: "Seleccione una enfermedad",
                          })}
                        >
                          <option value="">Seleccione una enfermedad</option>
                          {enfermedades?.map((enf) => (
                            <option
                              key={enf.idenfermedad}
                              value={enf.idenfermedad}
                            >
                              {enf.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.idenfermedad && (
                          <div className="invalid-feedback">
                            {errors.idenfermedad.message}
                          </div>
                        )}

                        <label
                          htmlFor="observacion"
                          className="form-label mt-2"
                        >
                          Observaciones:
                        </label>
                        <textarea
                          id="observacion"
                          className={`form-control ${
                            errors.observacion ? "is-invalid" : ""
                          }`}
                          {...register("observacion", {
                            required: "La observación es obligatoria",
                          })}
                        ></textarea>
                        {errors.observacion && (
                          <div className="invalid-feedback">
                            {errors.observacion.message}
                          </div>
                        )}

                        <label
                          htmlFor="idmedicamento"
                          className="form-label mt-2"
                        >
                          Medicamento:
                        </label>
                        <select
                          id="idmedicamento"
                          className={`form-select ${
                            errors.idmedicamento ? "is-invalid" : ""
                          }`}
                          {...register("idmedicamento", {
                            required: "Seleccione un medicamento",
                          })}
                        >
                          <option value="">Seleccione un medicamento</option>
                          {medicamentos?.map((med) => (
                            <option
                              key={med.idmedicamento}
                              value={med.idmedicamento}
                            >
                              {med.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.idmedicamento && (
                          <div className="invalid-feedback">
                            {errors.idmedicamento.message}
                          </div>
                        )}

                        <label htmlFor="dosis" className="form-label mt-2">
                          Dosis:
                        </label>
                        <input
                          id="dosis"
                          type="text"
                          className={`form-control ${
                            errors.dosis ? "is-invalid" : ""
                          }`}
                          {...register("dosis", {
                            required: "La dosis es obligatoria",
                          })}
                        />
                        {errors.dosis && (
                          <div className="invalid-feedback">
                            {errors.dosis.message}
                          </div>
                        )}
                      </>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        mutationCita.isPending || mutationDiagnostico.isPending
                      }
                    >
                      {mutationCita.isPending || mutationDiagnostico.isPending
                        ? "Generando ..."
                        : "Generar"}
                    </button>
                  </fieldset>
                </form>
                {/* <button className="btn btn-primary">Agregar</button> */}
              </div>
            </div>
            {/* <div className="row mt-2 me-5">
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
            </div> */}
            <div className="row mt-2 me-5">
              <div className="col-12 d-flex justify-content-end">
                <Link to={"/medico/citas"} className="btn btn-secondary me-3">
                  Volver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GenerarDiagnostico;
