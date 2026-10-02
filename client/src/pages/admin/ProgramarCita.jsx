import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProgracionCita,
  getDataProgramarCita,
  getHorarios,
} from "../../api/citas";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Modal from "../../components/Modal";
import { useState } from "react";

function ProgramarCita() {
  const { idconsultorio_posta } = useParams();
  
  // Estado del modal
  const [modal, setModal] = useState({
    show: false,
    estado: true,
    titulo: "",
    message: "",
  });
  
  // Navegacion
  const navigate = useNavigate();

  // Peticion de datos a actualizar
  const {
    data,
    isLoading: isDataLoad,
    isError: isDataError,
  } = useQuery({
    queryKey: ["data-cita", idconsultorio_posta],
    queryFn: () => getDataProgramarCita(idconsultorio_posta),
  });

  // Peticion de horarios
  const {
    data: horarios,
    isLoading: isHoraLoad,
    isError: isHoraError,
  } = useQuery({
    queryKey: ["horarios"],
    queryFn: getHorarios,
  });

  // Registrar
  const mutation = useMutation({
    mutationFn: (formData) => createProgracionCita(formData),
    onSuccess: (resData) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Programación Exitosa",
        message: "La jornada de citas ha sido programada con éxito en el consultorio.",
      });
      console.log("La cita ha sido programada con exito: ", resData);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: `No se pudo programar la cita. ${error?.response?.data?.error || "Intente nuevamente."}`,
      });
      console.log("Hubo un error al programar la cita: ", error);
    },
  });

  // Manejo del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((formData) => {
    mutation.mutate(formData);
  });

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate(`/admin/programacion-citas`);
    }
  };

  if (isDataLoad || isHoraLoad) return <Loading nombre="datos de cita ..." />;
  if (isDataError || isHoraError)
    return <ErrorPage code={500} message={"Ocurrió un error al cargar la programación."} />;

  return (
    <div className="container py-4">
      {modal.show && (
        <Modal
          titulo={modal.titulo}
          estado={modal.estado}
          mensaje={modal.message}
          setModal={setModal}
          onClose={handleModalClose}
        />
      )}

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Link to={`/admin/postas/${data?.posta?.idposta}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Posta
          </Link>
          <h2 className="mb-0 fw-bold">Programar Cupos y Citas Médicas</h2>
        </div>
      </div>

      <div className="row g-4">
        {/* Resumen Posta y Consultorio */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light">
                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-geo-alt fs-5"></i>
                </div>
                <h5 className="fw-bold mb-0 text-primary">Ubicación</h5>
              </div>

              <div className="mb-4">
                <span className="text-muted small d-block">Posta Médica</span>
                <h5 className="fw-bold text-dark">{data?.posta?.nombre}</h5>
              </div>

              <div className="mb-4">
                <span className="text-muted small d-block">Consultorio Asignado</span>
                <h5 className="fw-bold text-primary">{data?.consultorio?.nombre}</h5>
              </div>

              <div className="alert alert-info py-2 px-3 small border-0 mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <span>Los cupos creados estarán disponibles inmediatamente para los pacientes.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            {data?.doctores?.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-person-x fs-1 d-block mb-3 text-secondary"></i>
                <h5>No existen médicos asignados a este consultorio</h5>
                <p className="small mb-0">Primero asigne médicos a este consultorio en la sección de administración.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <fieldset disabled={mutation.isPending}>
                  <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-light">
                    <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-calendar-check fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-0 text-primary">Detalles de la Programación</h5>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="idmedconposta" className="form-label fw-semibold small text-muted">
                        Médico Responsable
                      </label>
                      <select
                        id="idmedconposta"
                        className={`form-select ${errors.idmedconposta ? "is-invalid" : ""}`}
                        {...register("idmedconposta", {
                          required: "El médico es requerido",
                        })}
                      >
                        <option value="">Seleccione un médico</option>
                        {data?.doctores?.map((doctor) => (
                          <option
                            key={doctor.iddoctor}
                            value={doctor.idconsultorio_medico_posta}
                          >
                            {doctor.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.idmedconposta && (
                        <div className="invalid-feedback">{errors.idmedconposta.message}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="idhorario" className="form-label fw-semibold small text-muted">
                        Turno / Horario de Atención
                      </label>
                      <select
                        id="idhorario"
                        className={`form-select ${errors.idhorario ? "is-invalid" : ""}`}
                        {...register("idhorario", {
                          required: "El horario es requerido",
                        })}
                      >
                        <option value="">Seleccione un horario</option>
                        {horarios?.map((horario) => (
                          <option
                            key={horario.idhorario}
                            value={horario.idhorario}
                          >
                            {horario.hora}
                          </option>
                        ))}
                      </select>
                      {errors.idhorario && (
                        <div className="invalid-feedback">{errors.idhorario.message}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="fecha" className="form-label fw-semibold small text-muted">
                        Fecha de la Cita
                      </label>
                      <input
                        id="fecha"
                        type="date"
                        className={`form-control ${errors.fecha ? "is-invalid" : ""}`}
                        {...register("fecha", {
                          required: "La fecha es requerida",
                          validate: {
                            futureDate: (value) => {
                              const today = new Date().toISOString().split("T")[0];
                              if (value <= today) {
                                return "La fecha debe ser posterior al día de hoy";
                              }
                              return true;
                            },
                          },
                        })}
                      />
                      {errors.fecha && (
                        <div className="invalid-feedback">{errors.fecha.message}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="cupos_totales" className="form-label fw-semibold small text-muted">
                        Cantidad Total de Cupos
                      </label>
                      <input
                        id="cupos_totales"
                        type="number"
                        placeholder="Ej. 10 (máx 20)"
                        className={`form-control ${errors.cupos_totales ? "is-invalid" : ""}`}
                        {...register("cupos_totales", {
                          required: "Ingrese los cupos de la cita",
                          min: {
                            value: 1,
                            message: "El número de cupos debe ser mayor que 0",
                          },
                          max: {
                            value: 20,
                            message: "El número de cupos no puede ser mayor a 20",
                          },
                        })}
                      />
                      {errors.cupos_totales && (
                        <div className="invalid-feedback">{errors.cupos_totales.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top border-light">
                    <Link
                      to={`/admin/postas/${data?.posta?.idposta}`}
                      className="btn btn-outline-secondary px-4"
                    >
                      Cancelar
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Programando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-calendar-plus me-1"></i> Programar Citas
                        </>
                      )}
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramarCita;
