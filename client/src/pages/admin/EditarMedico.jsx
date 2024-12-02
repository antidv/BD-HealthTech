import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getEspecialidades,
  getDatosActualizarMedico,
  updateMedico,
} from "../../api/medicos";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Modal from "../../components/Modal";
import { useState } from "react";

function EditarMedico() {
  const { idmedico } = useParams();

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
    isLoading: isMedicoLoading,
    isError: isMedicoError,
  } = useQuery({
    queryKey: ["medico", idmedico],
    queryFn: () => getDatosActualizarMedico(idmedico),
  });

  // Peticion de especialidades
  const {
    data: especialidades,
    isLoading: isEspLoading,
    isError: isEspError,
  } = useQuery({
    queryKey: ["especialidades"],
    queryFn: getEspecialidades,
  });

  // Actualizar medico y sus consultorios
  const mutation = useMutation({
    mutationFn: (data) => updateMedico(idmedico, data),
    onSuccess: (data) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Actualizacion exitosa",
        message: `El medico se ha actualizado con éxito.`,
      });
      console.log("Medico actualizado: ", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrio un error",
        message: "Error: No se pudo actualizar el medico.",
      });
      console.error("Error al actualizar el medico", error);
    },
  });

  // Manejo del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellidoP: "",
      apellidoM: "",
      dni: "",
      especialidad: "",
      idconsultorio_posta: [],
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      // Navegar solo si la operación fue exitosa
      navigate(`/admin/medicos/${idmedico}`);
    }
  };

  if (isEspLoading || isMedicoLoading)
    return <Loading nombre="medico y especialidades ..." />;
  if (isEspError || isMedicoError)
    return <ErrorPage code={500} message={"Ocurrió un error"} />;

  // Establecer valores
  if (data.medico) {
    setValue("nombre", data.medico.nombre);
    setValue("apellidoP", data.medico.apellidoP);
    setValue("apellidoM", data.medico.apellidoM);
    setValue("dni", data.medico.dni);
    setValue("especialidad", data.medico.idespecialidad);
    setValue("correo", data.medico.correo);
    setValue("disponible", data.medico.disponible);
  }

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-4 justify-content-center">
            {/* Dato de medico */}
            <div className="card m-5 cardConsultorioMedico">
              <h2 className="m-3 text-center">{data.medico.nombre + " " + data.medico.apellidoP}</h2>
              <div className="d-flex justify-content-center">
                <img src={data.medico.foto} alt="medico" width={200} />
              </div>
              <div className="card-body">
                <p className="card-text">
                  <b>DNI: </b>
                  {data.medico.dni}
                </p>
                <p className="card-text">
                  <b>Especialidad: </b>
                  {data.medico.especialidad}
                </p>
              </div>
            </div>
          </div>
          <div className="col-8 d-flex flex-column">
            {/* Modal */}
            {modal.show && (
              <Modal
                titulo={modal.titulo}
                estado={modal.estado}
                mensaje={modal.message}
                setModal={setModal}
                onClose={handleModalClose}
              />
            )}
            <h2 className="mt-5 me-5">Editar médico</h2>
            {/* Formulario */}
            <form onSubmit={onSubmit}>
              {/* Datos de medico */}
              <div className="row me-5">
                <div className="col-6 mb-3">
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
                  {errors.nombre && <p className="invalid-feedback">{errors.nombre.message}</p>}
                </div>
                <div className="col-6 mb-3">
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
                  {errors.apellidoP && <p className="invalid-feedback">{errors.apellidoP.message}</p>}
                </div>
              </div>
              <div className="row me-5">
                <div className="col-6 mb-3">
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
                  {errors.apellidoM && <p className="invalid-feedback">{errors.apellidoM.message}</p>}
                </div>
                <div className="col-6 mb-3">
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
                  {errors.dni && <p className="invalid-feedback">{errors.dni.message}</p>}
                </div>
              </div>
              
              <div className="row me-5">
                <div className="col-6 mb-3">
                  <label htmlFor="especialidad" className="form-label">
                    Especialidad
                  </label>
                  <select
                    className="form-select"
                    {...register("especialidad", {
                      required: "La especialidad es requerida",
                    })}
                  >
                    <option value="">Seleccione una especialidad</option>
                    {especialidades?.map((esp) => (
                      <option key={esp.idespecialidad} value={esp.idespecialidad}>
                        {esp.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.especialidad && <p className="invalid-feedback">{errors.especialidad.message}</p>}
                </div>

                {/* <div className="col-6 mb-3">
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
                </div> */}
              </div>
              
              <div className="row me-5">
                {/* <div className="col-6 mb-3">
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
                <div className="col-6 mb-3">
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
                  {errors.confirmarContra && <p>{errors.confirmarContra.message}</p>}
                </div> */}
              </div>
              
              <div className="row me-5">
                <div className="col-6 mb-3 d-flex">
                  <label htmlFor="estado" className="form-label">Disponible</label>
                  <input type="checkbox" id="estado" {...register("disponible")} className="ms-2 form-check" />
                </div>
              </div>
              
              {/* Datos de consultorios faltantes */}
              <div className="row me-5 mt-2">
                <div className="col-12">
                  <h2>Consultorios faltantes</h2>
                </div>
                {data.consultoriosFaltantes?.length === 0 ? (
                  <p>No se encontraron consultorios disponibles</p>
                ) : (
                  data.consultoriosFaltantes?.map((consultorio_faltante) => (
                    <div key={consultorio_faltante.idconsultorio_posta} className="col-6 mb-3 d-flex">
                      <input
                        type="checkbox"
                        value={consultorio_faltante.idconsultorio_posta}
                        className="form-check-input"
                        {...register("idconsultorio_posta")}
                      />
                      <label className="form-check-label ms-2">
                        <b>Posta: </b>
                        {consultorio_faltante.nombre_posta}
                        <br />
                        <b>Consultorio: </b>
                        {consultorio_faltante.nombre_consultorio}
                      </label>
                    </div>
                  ))
                )}
              </div>
              
              <div className="row me-5">
                <div className="col-12 d-flex justify-content-end">
                  <Link
                    to={`/admin/medicos/${idmedico}`}
                    className="btn btn-secondary me-3"
                  >
                    Volver
                  </Link>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="btn btn-primary"
                  >
                    {mutation.isPending ? "Actualizando ..." : "Actualizar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditarMedico;
