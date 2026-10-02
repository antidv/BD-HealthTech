import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { createMedico, getEspecialidades } from "../../api/medicos";
import Modal from "../../components/Modal";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function RegistrarMedico() {
  // Estado del modal
  const [modal, setModal] = useState({
    show: false,
    estado: true,
    titulo: "",
    message: "",
  });

  // Navegacion
  const navigate = useNavigate();

  // Manejo del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  // Obtener las especialidades
  const {
    data: especialidades,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["especialidades"],
    queryFn: getEspecialidades,
  });

  // Registrar nuevo medico
  const mutation = useMutation({
    mutationFn: createMedico,
    onSuccess: (data) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Registro exitoso",
        message: `El médico se ha registrado con éxito en el sistema.`,
      });
      console.log("Médico registrado: ", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: "No se pudo registrar el médico. Verifique los datos e intente nuevamente.",
      });
      console.error("Error al crear el médico: ", error);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate("/admin/medicos");
    }
  };

  if (isLoading) return <Loading nombre="especialidades ..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error al cargar las especialidades." />;

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
          <Link to="/admin/medicos" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Médicos
          </Link>
          <h2 className="mb-0 fw-bold">Registrar Médico</h2>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <form onSubmit={onSubmit}>
              <fieldset disabled={mutation.isPending}>
                <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-light">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-person-vcard fs-5"></i>
                  </div>
                  <h5 className="fw-bold mb-0 text-primary">Información Personal y Profesional</h5>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label htmlFor="nombre" className="form-label fw-semibold small text-muted">
                      Nombres
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Ej. Carlos"
                      className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                      {...register("nombre", {
                        required: "El nombre es obligatorio",
                      })}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre.message}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="apellidoP" className="form-label fw-semibold small text-muted">
                      Apellido Paterno
                    </label>
                    <input
                      id="apellidoP"
                      type="text"
                      placeholder="Ej. Ramos"
                      className={`form-control ${errors.apellidoP ? "is-invalid" : ""}`}
                      {...register("apellidoP", {
                        required: "El apellido paterno es obligatorio",
                      })}
                    />
                    {errors.apellidoP && (
                      <div className="invalid-feedback">{errors.apellidoP.message}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="apellidoM" className="form-label fw-semibold small text-muted">
                      Apellido Materno
                    </label>
                    <input
                      id="apellidoM"
                      type="text"
                      placeholder="Ej. Pérez"
                      className={`form-control ${errors.apellidoM ? "is-invalid" : ""}`}
                      {...register("apellidoM", {
                        required: "El apellido materno es obligatorio",
                      })}
                    />
                    {errors.apellidoM && (
                      <div className="invalid-feedback">{errors.apellidoM.message}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="dni" className="form-label fw-semibold small text-muted">
                      Documento Nacional de Identidad (DNI)
                    </label>
                    <input
                      id="dni"
                      type="text"
                      placeholder="8 dígitos numéricos"
                      maxLength={8}
                      className={`form-control ${errors.dni ? "is-invalid" : ""}`}
                      {...register("dni", {
                        required: "El DNI es obligatorio",
                        pattern: {
                          value: /^\d{8}$/,
                          message: "El DNI debe contener exactamente 8 dígitos",
                        },
                      })}
                    />
                    {errors.dni && (
                      <div className="invalid-feedback">{errors.dni.message}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="especialidad" className="form-label fw-semibold small text-muted">
                      Especialidad Médica
                    </label>
                    <select
                      id="especialidad"
                      className={`form-select ${errors.especialidad ? "is-invalid" : ""}`}
                      {...register("especialidad", {
                        required: "La especialidad es requerida",
                      })}
                    >
                      <option value="">Seleccione una especialidad</option>
                      {especialidades?.map((esp) => (
                        <option key={esp.idespecialidad} value={esp.nombre}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.especialidad && (
                      <div className="invalid-feedback">{errors.especialidad.message}</div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4 pb-2 mt-5 border-bottom border-light">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-shield-lock fs-5"></i>
                  </div>
                  <h5 className="fw-bold mb-0 text-primary">Credenciales de Acceso</h5>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label htmlFor="correo" className="form-label fw-semibold small text-muted">
                      Correo Electrónico
                    </label>
                    <input
                      id="correo"
                      type="email"
                      placeholder="medico@posta.gob.pe"
                      className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                      {...register("correo", {
                        required: "El correo es obligatorio",
                        pattern: {
                          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                          message: "Formato de correo no válido",
                        },
                      })}
                    />
                    {errors.correo && (
                      <div className="invalid-feedback">{errors.correo.message}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="contrasenia" className="form-label fw-semibold small text-muted">
                      Contraseña
                    </label>
                    <input
                      id="contrasenia"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      className={`form-control ${errors.contrasenia ? "is-invalid" : ""}`}
                      {...register("contrasenia", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                      })}
                    />
                    {errors.contrasenia && (
                      <div className="invalid-feedback">{errors.contrasenia.message}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="confirmarContra" className="form-label fw-semibold small text-muted">
                      Confirmar Contraseña
                    </label>
                    <input
                      id="confirmarContra"
                      type="password"
                      placeholder="Repita la contraseña"
                      className={`form-control ${errors.confirmarContra ? "is-invalid" : ""}`}
                      {...register("confirmarContra", {
                        required: "Debe confirmar la contraseña",
                        validate: (value) =>
                          value === getValues("contrasenia") ||
                          "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.confirmarContra && (
                      <div className="invalid-feedback">{errors.confirmarContra.message}</div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top border-light">
                  <Link to="/admin/medicos" className="btn btn-outline-secondary px-4">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn btn-primary px-4"
                  >
                    {mutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-1"></i> Registrar Médico
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
  );
}

export default RegistrarMedico;
