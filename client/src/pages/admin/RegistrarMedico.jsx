import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { createMedico } from "../../api/medicos";
import Modal from "../../components/Modal";

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
    navigate("/admin/medicos");
  };

  return (
    <>
      {modal.show && (
        <Modal
          titulo={modal.titulo}
          estado={modal.estado}
          mensaje={modal.message}
          setModal={setModal}
          onClose={handleModalClose}
        />
      )}
      <h1>Registrar Medico</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="nombre">Nombres</label>
          <input
            id="nombre"
            type="text"
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>
        <div>
          <label htmlFor="apellidoP">Apellido paterno</label>
          <input
            id="apellidoP"
            type="text"
            {...register("apellidoP", {
              required: "El apellido paterno es obligatorio",
            })}
          />
          {errors.apellidoP && <p>{errors.apellidoP.message}</p>}
        </div>
        <div>
          <label htmlFor="apellidoM">Apellido materno</label>
          <input
            id="apellidoM"
            type="text"
            {...register("apellidoM", {
              required: "El apellido materno es obligatorio",
            })}
          />
          {errors.apellidoM && <p>{errors.apellidoM.message}</p>}
        </div>
        <div>
          <label htmlFor="dni">DNI</label>
          <input
            id="dni"
            type="text"
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
        <div>
          <label htmlFor="especialidad">Especialidad</label>
          <input
            id="especialidad"
            type="text"
            {...register("especialidad", {
              required: "La especialidad es obligatoria",
            })}
          />
          {errors.especialidad && <p>{errors.especialidad.message}</p>}
        </div>
        <div>
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="text"
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
        <div>
          <label htmlFor="contrasenia">Contraseña</label>
          <input
            id="contrasenia"
            type="password"
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
        <div>
          <label htmlFor="confirmarContra">Confirmar contraseña</label>
          <input
            id="confirmarContra"
            type="password"
            {...register("confirmarContra", {
              required: "Confirmar la contraseña es importante",
              validate: (value) =>
                value === getValues("contrasenia") ||
                "Las contraseñas no coinciden",
            })}
          />
          {errors.confirmarContra && <p>{errors.confirmarContra.message}</p>}
        </div>
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
      </form>
    </>
  );
}

export default RegistrarMedico;
