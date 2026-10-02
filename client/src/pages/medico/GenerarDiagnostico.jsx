import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getCitaMedico } from "../../api/medicos";
import {
  getEnfermedades,
  getMedicamentos,
} from "../../api/antecedentes";
import { updateCitaMedico, createDiagnosticoCita } from "../../api/citas";
import { getPerfilPacienteId } from "../../api/paciente";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import CardPaciente from "../../components/cards/CardPaciente";

function GenerarDiagnostico() {
  const { idcita } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
  const navigate = useNavigate();

  const {
    data: cita,
    isLoading: isCLoad,
    isError: isCError,
  } = useQuery({
    queryKey: ["cita", idcita],
    queryFn: () => getCitaMedico(idcita),
  });

  const {
    data: paciente,
    isLoading: isPacLoad,
    isError: isPacError,
  } = useQuery({
    queryKey: ["paciente", cita?.idpaciente],
    queryFn: () => getPerfilPacienteId(cita?.idpaciente),
    enabled: !!cita,
  });

  const {
    data: enfermedades,
    isLoading: isEnfLoad,
    isError: isEnfError,
  } = useQuery({
    queryKey: ["enfermedades"],
    queryFn: getEnfermedades,
  });

  const {
    data: medicamentos,
    isLoading: isMedLoad,
    isError: isMedError,
  } = useQuery({
    queryKey: ["medicamentos"],
    queryFn: getMedicamentos,
  });

  const mutationCita = useMutation({
    mutationKey: ["actualizar-cita"],
    mutationFn: ({ idcita, data }) => updateCitaMedico(idcita, data),
  });
  const mutationDiagnostico = useMutation({
    mutationFn: ({ idcita, data }) => createDiagnosticoCita(idcita, data),
  });

  const onSubmit = (data) => {
    const { triaje, estado, idenfermedad, observacion, idmedicamento, dosis } =
      data;

    const citaData = { triaje, estado };

    mutationCita.mutate(
      { idcita, data: citaData },
      {
        onSuccess: () => {
          navigate(`/medico/citas`);
        },
        onError: (error) => {
          console.error("Error al actualizar la cita: ", error);
        },
      }
    );

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
          onError: (error) => {
            console.error("Error al crear el diagnóstico: ", error);
          },
        }
      );
    }
  };

  if (isCLoad || isPacLoad || isEnfLoad || isMedLoad)
    return <Loading nombre="datos de cita y paciente..." />;
  if (isCError || isPacError || isEnfError || isMedError)
    return <ErrorPage code={500} message={"Ocurrió un error al cargar la información"} />;

  return (
    <div className="containerColor py-4">
      <div className="container" style={{ maxWidth: "1280px" }}>
        <div className="row g-4 align-items-start">
          {/* Card del paciente */}
          <div className="col-12 col-lg-4">
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

          {/* Formulario de Diagnóstico */}
          <div className="col-12 col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="fw-bold mb-0">Atención y Diagnóstico</h2>
                <p className="text-muted small mb-0">Registra el triaje y el diagnóstico médico</p>
              </div>
              <Link to="/medico/citas" className="btn btn-secondary shadow-sm">
                <i className="bi bi-arrow-left me-1"></i> Volver
              </Link>
            </div>

            {/* Resumen de la cita */}
            <div className="card border-0 shadow-sm mb-4 p-4">
              <div className="row g-3">
                <div className="col-12 col-sm-4">
                  <span className="text-muted small d-block">Fecha de cita</span>
                  <span className="fw-semibold">
                    <i className="bi bi-calendar-check me-1 text-primary"></i>
                    {cita.fecha}
                  </span>
                </div>
                <div className="col-12 col-sm-4">
                  <span className="text-muted small d-block">Consultorio</span>
                  <span className="badge bg-light text-dark border">{cita.consultorio}</span>
                </div>
                <div className="col-12 col-sm-4">
                  <span className="text-muted small d-block">Motivo de consulta</span>
                  <span className="fw-semibold text-dark">{cita.motivo}</span>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="card border-0 shadow-sm p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={mutationCita.isPending || mutationDiagnostico.isPending}>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label htmlFor="triaje" className="form-label">
                        Triaje (Presión, Temp, etc.):
                      </label>
                      <input
                        id="triaje"
                        type="text"
                        placeholder="Ej. PA 120/80, T 36.8°C"
                        className={`form-control ${errors.triaje ? "is-invalid" : ""}`}
                        {...register("triaje", {
                          required: "El triaje es obligatorio",
                        })}
                      />
                      {errors.triaje && (
                        <div className="invalid-feedback">{errors.triaje.message}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="estado" className="form-label">
                        Estado de la Cita:
                      </label>
                      <select
                        id="estado"
                        className={`form-select ${errors.estado ? "is-invalid" : ""}`}
                        {...register("estado", {
                          required: "El estado es obligatorio",
                        })}
                      >
                        <option value="">Seleccione el estado</option>
                        <option value="Atendido">Atendido</option>
                        <option value="Ausente">Ausente</option>
                      </select>
                      {errors.estado && (
                        <div className="invalid-feedback">{errors.estado.message}</div>
                      )}
                    </div>
                  </div>

                  {estado !== "Ausente" && (
                    <div className="border-top pt-4 mt-2">
                      <h5 className="fw-bold mb-3 text-primary">
                        <i className="bi bi-prescription2 me-2"></i>
                        Prescripción y Diagnóstico
                      </h5>

                      <div className="mb-3">
                        <label htmlFor="idenfermedad" className="form-label">
                          Diagnóstico / Enfermedad:
                        </label>
                        <select
                          id="idenfermedad"
                          className={`form-select ${errors.idenfermedad ? "is-invalid" : ""}`}
                          {...register("idenfermedad", {
                            required: "Seleccione una enfermedad",
                          })}
                        >
                          <option value="">Seleccione una enfermedad</option>
                          {enfermedades?.map((enf) => (
                            <option key={enf.idenfermedad} value={enf.idenfermedad}>
                              {enf.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.idenfermedad && (
                          <div className="invalid-feedback">{errors.idenfermedad.message}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="observacion" className="form-label">
                          Observaciones clínicas:
                        </label>
                        <textarea
                          id="observacion"
                          rows="3"
                          placeholder="Indicaciones para el paciente o detalles clínicos..."
                          className={`form-control ${errors.observacion ? "is-invalid" : ""}`}
                          {...register("observacion", {
                            required: "La observación es obligatoria",
                          })}
                        ></textarea>
                        {errors.observacion && (
                          <div className="invalid-feedback">{errors.observacion.message}</div>
                        )}
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                          <label htmlFor="idmedicamento" className="form-label">
                            Medicamento:
                          </label>
                          <select
                            id="idmedicamento"
                            className={`form-select ${errors.idmedicamento ? "is-invalid" : ""}`}
                            {...register("idmedicamento", {
                              required: "Seleccione un medicamento",
                            })}
                          >
                            <option value="">Seleccione un medicamento</option>
                            {medicamentos?.map((med) => (
                              <option key={med.idmedicamento} value={med.idmedicamento}>
                                {med.nombre}
                              </option>
                            ))}
                          </select>
                          {errors.idmedicamento && (
                            <div className="invalid-feedback">{errors.idmedicamento.message}</div>
                          )}
                        </div>

                        <div className="col-12 col-md-6">
                          <label htmlFor="dosis" className="form-label">
                            Dosis / Frecuencia:
                          </label>
                          <input
                            id="dosis"
                            type="text"
                            placeholder="Ej. 1 tableta cada 8 horas por 3 días"
                            className={`form-control ${errors.dosis ? "is-invalid" : ""}`}
                            {...register("dosis", {
                              required: "La dosis es obligatoria",
                            })}
                          />
                          {errors.dosis && (
                            <div className="invalid-feedback">{errors.dosis.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                    <Link to="/medico/citas" className="btn btn-secondary px-4">
                      Cancelar
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-warning px-4 fw-bold shadow-sm"
                      disabled={mutationCita.isPending || mutationDiagnostico.isPending}
                    >
                      {mutationCita.isPending || mutationDiagnostico.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2-circle me-1"></i>
                          Guardar Atención
                        </>
                      )}
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerarDiagnostico;
