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
import { useState, useEffect } from "react";

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
    mutationFn: (formData) => updateMedico(idmedico, formData),
    onSuccess: (resData) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Actualización exitosa",
        message: `Los datos del médico se han actualizado con éxito.`,
      });
      console.log("Medico actualizado: ", resData);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: "No se pudo actualizar el médico. Intente nuevamente.",
      });
      console.error("Error al actualizar el medico", error);
    },
  });

  // Manejo del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellidoP: "",
      apellidoM: "",
      dni: "",
      especialidad: "",
      disponible: true,
      idconsultorio_posta: [],
    },
  });

  useEffect(() => {
    if (data?.medico) {
      setValue("nombre", data.medico.nombre || "");
      setValue("apellidoP", data.medico.apellidoP || "");
      setValue("apellidoM", data.medico.apellidoM || "");
      setValue("dni", data.medico.dni || "");
      setValue("especialidad", data.medico.idespecialidad || "");
      setValue("correo", data.medico.correo || "");
      setValue("disponible", !!data.medico.disponible);
    }
  }, [data, setValue]);

  const onSubmit = handleSubmit((formData) => {
    mutation.mutate(formData);
  });

  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate(`/admin/medicos/${idmedico}`);
    }
  };

  if (isEspLoading || isMedicoLoading)
    return <Loading nombre="médico y especialidades..." />;
  if (isEspError || isMedicoError)
    return <ErrorPage code={500} message={"Ocurrió un error al obtener los datos del médico."} />;

  const nombreCompleto = `${data?.medico?.nombre || ""} ${data?.medico?.apellidoP || ""} ${data?.medico?.apellidoM || ""}`.trim();

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
          <Link to={`/admin/medicos/${idmedico}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Detalles
          </Link>
          <h2 className="mb-0 fw-bold">Editar Médico</h2>
        </div>
      </div>

      <div className="row g-4">
        {/* Resumen del médico */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
            <div className="card-body text-center p-4">
              <div className="avatar-frame mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                <img
                  src={data.medico.foto || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300"}
                  alt={nombreCompleto}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h4 className="fw-bold mb-1">{nombreCompleto}</h4>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-3">
                <i className="bi bi-award me-1"></i>
                {data.medico.especialidad}
              </span>

              <hr className="my-3 opacity-25" />

              <div className="text-start">
                <div className="d-flex justify-content-between py-2 border-bottom border-light">
                  <span className="text-muted"><i className="bi bi-card-text me-2"></i>DNI</span>
                  <span className="fw-semibold">{data.medico.dni}</span>
                </div>
                {data.medico.correo && (
                  <div className="d-flex justify-content-between py-2 border-bottom border-light">
                    <span className="text-muted"><i className="bi bi-envelope me-2"></i>Correo</span>
                    <span className="fw-semibold text-truncate" style={{ maxWidth: "160px" }}>{data.medico.correo}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted"><i className="bi bi-activity me-2"></i>Estado actual</span>
                  <span className={`fw-semibold ${data.medico.disponible ? "text-success" : "text-danger"}`}>
                    {data.medico.disponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <form onSubmit={onSubmit}>
              <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-light">
                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-pencil-square fs-5"></i>
                </div>
                <h5 className="fw-bold mb-0 text-primary">Datos del Médico</h5>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="nombre" className="form-label fw-semibold small text-muted">
                    Nombres
                  </label>
                  <input
                    disabled={mutation.isPending}
                    id="nombre"
                    type="text"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback">{errors.nombre.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="apellidoP" className="form-label fw-semibold small text-muted">
                    Apellido Paterno
                  </label>
                  <input
                    disabled={mutation.isPending}
                    id="apellidoP"
                    type="text"
                    className={`form-control ${errors.apellidoP ? "is-invalid" : ""}`}
                    {...register("apellidoP", {
                      required: "El apellido paterno es obligatorio",
                    })}
                  />
                  {errors.apellidoP && (
                    <div className="invalid-feedback">{errors.apellidoP.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="apellidoM" className="form-label fw-semibold small text-muted">
                    Apellido Materno
                  </label>
                  <input
                    disabled={mutation.isPending}
                    id="apellidoM"
                    type="text"
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
                    DNI
                  </label>
                  <input
                    disabled={mutation.isPending}
                    id="dni"
                    type="text"
                    maxLength={8}
                    className={`form-control ${errors.dni ? "is-invalid" : ""}`}
                    {...register("dni", {
                      required: "El DNI es obligatorio",
                      pattern: {
                        value: /^\d{8}$/,
                        message: "El DNI debe tener 8 dígitos",
                      },
                    })}
                  />
                  {errors.dni && (
                    <div className="invalid-feedback">{errors.dni.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="especialidad" className="form-label fw-semibold small text-muted">
                    Especialidad
                  </label>
                  <select
                    disabled={mutation.isPending}
                    id="especialidad"
                    className={`form-select ${errors.especialidad ? "is-invalid" : ""}`}
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
                  {errors.especialidad && (
                    <div className="invalid-feedback">{errors.especialidad.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch pb-2">
                    <input
                      disabled={mutation.isPending}
                      type="checkbox"
                      id="disponible"
                      {...register("disponible")}
                      className="form-check-input"
                    />
                    <label htmlFor="disponible" className="form-check-label fw-semibold">
                      Médico Disponible en el Sistema
                    </label>
                  </div>
                </div>
              </div>

              {/* Asignar nuevos consultorios faltantes */}
              {data.consultoriosFaltantes && data.consultoriosFaltantes.length > 0 && (
                <div className="mt-5 pt-3 border-top border-light">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                      <i className="bi bi-building-add fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-0 text-primary">Asignar a Nuevos Consultorios</h5>
                  </div>
                  <div className="row g-3">
                    {data.consultoriosFaltantes.map((consultorio_faltante) => (
                      <div
                        key={consultorio_faltante.idconsultorio_posta}
                        className="col-12 col-md-6"
                      >
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                          <input
                            disabled={mutation.isPending}
                            type="checkbox"
                            id={`confalt_${consultorio_faltante.idconsultorio_posta}`}
                            value={consultorio_faltante.idconsultorio_posta}
                            className="form-check-input mt-0"
                            {...register("idconsultorio_posta")}
                          />
                          <label
                            htmlFor={`confalt_${consultorio_faltante.idconsultorio_posta}`}
                            className="form-check-label flex-grow-1"
                          >
                            <span className="d-block fw-bold small text-primary">
                              {consultorio_faltante.nombre_posta}
                            </span>
                            <span className="small text-muted">
                              <i className="bi bi-door-open me-1"></i>
                              {consultorio_faltante.nombre_consultorio}
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top border-light">
                <Link
                  to={`/admin/medicos/${idmedico}`}
                  className="btn btn-outline-secondary px-4"
                >
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
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i> Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarMedico;
