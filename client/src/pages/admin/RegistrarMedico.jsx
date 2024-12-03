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
        message: `El médico se ha creado con éxito.`,
      });
      console.log("Médico registrado: ", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: "Error: No se pudo crear el médico. Inténtalo de nuevo.",
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
  if (isError) return <ErrorPage code={500} message="Ocurrió un error ..." />;

  return (
    <>
      <div className="container-fluid containerColor vh-100">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            {modal.show && (
              <Modal
                titulo={modal.titulo}
                estado={modal.estado}
                mensaje={modal.message}
                setModal={setModal}
                onClose={handleModalClose}
              />
            )}
            <h2 className="m-3">Registrar médico</h2>
          </div>
        </div>
        <div className="row m-3">
          <form onSubmit={onSubmit}>
            <fieldset disabled={mutation.isPending}>
              <div className="row m-3">
                <div className="col-3 mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombres
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className={`form-control ${
                      errors.nombre ? "is-invalid" : ""
                    }`}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.nombre && (
                    <p className="invalid-feedback">{errors.nombre.message}</p>
                  )}
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="apellidoP" className="form-label">
                    Apellido paterno
                  </label>
                  <input
                    id="apellidoP"
                    type="text"
                    className={`form-control ${
                      errors.apellidoP ? "is-invalid" : ""
                    }`}
                    {...register("apellidoP", {
                      required: "El apellido paterno es obligatorio",
                    })}
                  />
                  {errors.apellidoP && (
                    <p className="invalid-feedback">
                      {errors.apellidoP.message}
                    </p>
                  )}
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="apellidoM" className="form-label">
                    Apellido materno
                  </label>
                  <input
                    id="apellidoM"
                    type="text"
                    className={`form-control ${
                      errors.apellidoM ? "is-invalid" : ""
                    }`}
                    {...register("apellidoM", {
                      required: "El apellido materno es obligatorio",
                    })}
                  />
                  {errors.apellidoM && (
                    <p className="invalid-feedback">
                      {errors.apellidoM.message}
                    </p>
                  )}
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="dni" className="form-label">
                    DNI
                  </label>
                  <input
                    id="dni"
                    type="text"
                    className={`form-control ${errors.dni ? "is-invalid" : ""}`}
                    {...register("dni", {
                      required: "El dni es obligatorio",
                      pattern: {
                        value: /^\d{8}$/,
                        message: "Número de DNI no válido (8 dígitos)",
                      },
                    })}
                  />
                  {errors.dni && (
                    <p className="invalid-feedback">{errors.dni.message}</p>
                  )}
                </div>
              </div>
              <div className="row m-3">
                <div className="col-3 mb-3">
                  <label htmlFor="especialidad" className="form-label">
                    Especialidad
                  </label>
                  {/* select */}
                  <select
                    className={`form-select ${
                      errors.especialidad ? "is-invalid" : ""
                    }`}
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
                    <p className="invalid-feedback">
                      {errors.especialidad.message}
                    </p>
                  )}
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="correo" className="form-label">
                    Correo
                  </label>
                  <input
                    id="correo"
                    type="text"
                    className={`form-control ${
                      errors.correo ? "is-invalid" : ""
                    }`}
                    {...register("correo", {
                      required: "El correo es obligatorio",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Correo no válido",
                      },
                    })}
                  />
                  {errors.correo && (
                    <p className="invalid-feedback">{errors.correo.message}</p>
                  )}
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="contrasenia" className="form-label">
                    Contraseña
                  </label>
                  <input
                    id="contrasenia"
                    type="password"
                    className={`form-control ${
                      errors.contrasenia ? "is-invalid" : ""
                    }`}
                    {...register("contrasenia", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 8,
                        message: "La contraseña debe ser mayor a 8 caracteres",
                      },
                    })}
                  />
                  {errors.contrasenia && (
                    <p className="invalid-feedback">
                      {errors.contrasenia.message}
                    </p>
                  )}
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="confirmarContra" className="form-label">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmarContra"
                    type="password"
                    className={`form-control ${
                      errors.confirmarContra ? "is-invalid" : ""
                    }`}
                    {...register("confirmarContra", {
                      required: "Confirmar la contraseña es importante",
                      validate: (value) =>
                        value === getValues("contrasenia") ||
                        "Las contraseñas no coinciden",
                    })}
                  />
                  {errors.confirmarContra && (
                    <p className="invalid-feedback">
                      {errors.confirmarContra.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="row m-3">
                <div className="col-12 d-flex justify-content-end">
                  <Link to="/admin/medicos" className="btn btn-secondary me-3">
                    Volver
                  </Link>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn btn-primary"
                  >
                    {mutation.isPending ? "Registrando ..." : "Registrar"}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrarMedico;
