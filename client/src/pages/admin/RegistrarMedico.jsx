import { useForm } from "react-hook-form";

function RegistrarMedico() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log("Registrar medico: ", data);
  });

  return (
    <>
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
        <button type="submit">Registrar</button>
      </form>
    </>
  );
}

export default RegistrarMedico;
