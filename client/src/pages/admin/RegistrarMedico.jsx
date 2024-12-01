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
        message: `El medico se ha creado con éxito.`,
      });
      console.log("Medico registrado: ", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrio un error",
        message: "Error: No se pudo crear el medico. Inténtalo de nuevo.",
      });
      console.error("Error al crear el medico: ", error);
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
            <div className="row m-3">
              <div className="col-3 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombres
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="form-control"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {errors.nombre && <p>{errors.nombre.message}</p>}
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="apellidoP" className="form-label">
                  Apellido paterno
                </label>
                <input
                  id="apellidoP"
                  type="text"
                  className="form-control"
                  {...register("apellidoP", {
                    required: "El apellido paterno es obligatorio",
                  })}
                />
                {errors.apellidoP && <p>{errors.apellidoP.message}</p>}
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="apellidoM" className="form-label">
                  Apellido materno
                </label>
                <input
                  id="apellidoM"
                  type="text"
                  className="form-control"
                  {...register("apellidoM", {
                    required: "El apellido materno es obligatorio",
                  })}
                />
                {errors.apellidoM && <p>{errors.apellidoM.message}</p>}
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="dni" className="form-label">
                  DNI
                </label>
                <input
                  id="dni"
                  type="text"
                  className="form-control"
                  {...register("dni", {
                    required: "El dni es obligatorio",
                    pattern: {
                      value: /^\d{8}$/,
                      message: "Numero de dni no válido (8 digitos)",
                    },
                  })}
                />
                {errors.dni && <p>{errors.dni.message}</p>}
              </div>
            </div>
            <div className="row m-3">
              <div className="col-3 mb-3">
                <label htmlFor="especialidad" className="form-label">
                  Especialidad
                </label>
                {/* select */}
                <select
                  className="form-select"
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
                {errors.especialidad && <p>{errors.especialidad.message}</p>}
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="correo" className="form-label">
                  Correo
                </label>
                <input
                  id="correo"
                  type="text"
                  className="form-control"
                  {...register("correo", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Correo no válido",
                    },
                  })}
                />
                {errors.correo && <p>{errors.correo.message}</p>}
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="contrasenia" className="form-label">
                  Contraseña
                </label>
                <input
                  id="contrasenia"
                  type="password"
                  className="form-control"
                  {...register("contrasenia", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe ser mayor a 8 caracteres",
                    },
                  })}
                />
                {errors.contrasenia && <p>{errors.contrasenia.message}</p>}
              </div>
              <div className="col-3 mb-3">
                <label htmlFor="confirmarContra" className="form-label">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmarContra"
                  type="password"
                  className="form-control"
                  {...register("confirmarContra", {
                    required: "Confirmar la contraseña es importante",
                    validate: (value) =>
                      value === getValues("contrasenia") ||
                      "Las contraseñas no coinciden",
                  })}
                />
                {errors.confirmarContra && (
                  <p>{errors.confirmarContra.message}</p>
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
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrarMedico;
