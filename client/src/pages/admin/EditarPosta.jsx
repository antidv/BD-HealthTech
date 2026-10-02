import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getPosta, updateConsultoriosPosta } from "../../api/postas";
import { getConsultoriosPosta } from "../../api/consultorios";
import { getConsultoriosFaltantesPosta } from "../../api/consultorios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Modal from "../../components/Modal";
import { useState, useEffect } from "react";

function EditarPosta() {
  const { idposta } = useParams();

  // Estado del modal
  const [modal, setModal] = useState({
    show: false,
    estado: true,
    titulo: "",
    message: "",
  });

  // Navegacion
  const navigate = useNavigate();

  // Peticion de la posta
  const {
    data: posta,
    isLoading: isPostaLoading,
    isError: isPostaError,
  } = useQuery({
    queryKey: ["posta", idposta],
    queryFn: () => getPosta(idposta),
  });

  // Peticion de los consultorios que tiene
  const {
    data: consultorios,
    isLoading: isConsultoriosLoading,
    isError: isConsultoriosError,
  } = useQuery({
    queryKey: ["consultorios", { idposta }],
    queryFn: () => getConsultoriosPosta({ idposta }),
  });

  // Peticion de los consultorios faltantes
  const {
    data: consultoriosFaltantes,
    isLoading: isConsultoriosFaltantesLoading,
    isError: isConsultoriosFaltantesError,
  } = useQuery({
    queryKey: ["consultorios_faltantes", idposta],
    queryFn: () => getConsultoriosFaltantesPosta(idposta),
  });

  // Actualizar posta y consultorios
  const mutation = useMutation({
    mutationFn: (formData) => updateConsultoriosPosta(idposta, formData),
    onSuccess: (resData) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Actualización exitosa",
        message: `La posta se ha actualizado con éxito.`,
      });
      console.log("Posta actualizada: ", resData);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: "No se pudo actualizar la posta médica. Inténtelo de nuevo.",
      });
      console.error("Error al actualizar: ", error);
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
      ciudad: "",
      direccion: "",
      telefono: "",
      estado: true,
      consultorios: [],
      nuevos_consultorios: [],
    },
  });

  useEffect(() => {
    if (posta) {
      setValue("nombre", posta.nombre || "");
      setValue("ciudad", posta.ciudad || "");
      setValue("direccion", posta.direccion || "");
      setValue("telefono", posta.telefono || "");
      setValue("estado", !!posta.disponible);
    }
  }, [posta, setValue]);

  const onSubmit = handleSubmit((formData) => {
    mutation.mutate(formData);
  });

  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate(`/admin/postas/${idposta}`);
    }
  };

  if (isPostaLoading || isConsultoriosLoading || isConsultoriosFaltantesLoading)
    return <Loading nombre="posta y consultorios ..." />;
  if (isPostaError || isConsultoriosError || isConsultoriosFaltantesError)
    return <ErrorPage code={500} message="Ocurrió un error al cargar los datos." />;

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
          <Link to={`/admin/postas/${idposta}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Detalles
          </Link>
          <h2 className="mb-0 fw-bold">Editar Posta Médica</h2>
        </div>
      </div>

      <div className="row g-4">
        {/* Resumen de la Posta */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
            <div className="card-body text-center p-4">
              <div className="avatar-frame mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                <img
                  src={posta.foto || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300"}
                  alt={posta.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h4 className="fw-bold mb-1">{posta.nombre}</h4>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 mb-3">
                <i className="bi bi-geo-alt me-1"></i>
                {posta.ciudad}
              </span>

              <hr className="my-3 opacity-25" />

              <div className="text-start">
                <div className="d-flex justify-content-between py-2 border-bottom border-light">
                  <span className="text-muted"><i className="bi bi-geo me-2"></i>Dirección</span>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: "160px" }}>{posta.direccion}</span>
                </div>
                {posta.telefono && (
                  <div className="d-flex justify-content-between py-2 border-bottom border-light">
                    <span className="text-muted"><i className="bi bi-telephone me-2"></i>Teléfono</span>
                    <span className="fw-semibold">{posta.telefono}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted"><i className="bi bi-activity me-2"></i>Estado</span>
                  <span className={`fw-semibold ${posta.disponible ? "text-success" : "text-danger"}`}>
                    {posta.disponible ? "Disponible" : "No disponible"}
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
                <h5 className="fw-bold mb-0 text-primary">Información General</h5>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="nombre" className="form-label fw-semibold small text-muted">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    disabled={mutation.isPending}
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
                  <label htmlFor="ciudad" className="form-label fw-semibold small text-muted">
                    Ciudad
                  </label>
                  <input
                    id="ciudad"
                    type="text"
                    disabled={mutation.isPending}
                    className={`form-control ${errors.ciudad ? "is-invalid" : ""}`}
                    {...register("ciudad", {
                      required: "La ciudad es obligatoria",
                    })}
                  />
                  {errors.ciudad && (
                    <div className="invalid-feedback">{errors.ciudad.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="direccion" className="form-label fw-semibold small text-muted">
                    Dirección
                  </label>
                  <input
                    id="direccion"
                    type="text"
                    disabled={mutation.isPending}
                    className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                    {...register("direccion", {
                      required: "La dirección es obligatoria",
                    })}
                  />
                  {errors.direccion && (
                    <div className="invalid-feedback">{errors.direccion.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="telefono" className="form-label fw-semibold small text-muted">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="text"
                    disabled={mutation.isPending}
                    className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                    {...register("telefono", {
                      pattern: {
                        value: /^\d{7,9}$/,
                        message: "Ingrese un teléfono válido",
                      },
                    })}
                  />
                  {errors.telefono && (
                    <div className="invalid-feedback">{errors.telefono.message}</div>
                  )}
                </div>

                <div className="col-12">
                  <div className="form-check form-switch mt-2">
                    <input
                      disabled={mutation.isPending}
                      type="checkbox"
                      id="estado"
                      className="form-check-input"
                      {...register("estado")}
                    />
                    <label htmlFor="estado" className="form-check-label fw-semibold">
                      Posta Habilitada y Operativa
                    </label>
                  </div>
                </div>
              </div>

              {/* Consultorios Actuales */}
              <div className="mt-5 pt-3 border-top border-light">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-door-open fs-5"></i>
                  </div>
                  <h5 className="fw-bold mb-0 text-primary">Consultorios Asociados</h5>
                </div>

                {consultorios?.data?.length === 0 ? (
                  <p className="text-muted small">La posta no tiene consultorios registrados.</p>
                ) : (
                  <div className="row g-3">
                    {consultorios?.data?.map((consultorio, index) => (
                      <div key={consultorio.idconsultorio} className="col-12 col-md-6">
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                          <input
                            type="checkbox"
                            disabled={mutation.isPending}
                            id={`consultorios.${index}.disponible`}
                            className="form-check-input mt-0"
                            defaultChecked={consultorio.disponible}
                            {...register(`consultorios.${index}.disponible`)}
                          />
                          <label
                            htmlFor={`consultorios.${index}.disponible`}
                            className="form-check-label fw-semibold flex-grow-1"
                          >
                            {consultorio.consultorio_nombre}
                          </label>
                          <input
                            disabled={mutation.isPending}
                            type="hidden"
                            value={consultorio.idconsultorio}
                            {...register(`consultorios.${index}.idconsultorio`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consultorios Faltantes */}
              {consultoriosFaltantes && consultoriosFaltantes.length > 0 && (
                <div className="mt-5 pt-3 border-top border-light">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                      <i className="bi bi-plus-circle fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-0 text-primary">Agregar Nuevos Consultorios</h5>
                  </div>
                  <div className="row g-3">
                    {consultoriosFaltantes.map((consultorio_faltante) => (
                      <div
                        className="col-12 col-md-6"
                        key={consultorio_faltante.idconsultorio}
                      >
                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                          <input
                            disabled={mutation.isPending}
                            type="checkbox"
                            id={`nuevocons_${consultorio_faltante.idconsultorio}`}
                            value={consultorio_faltante.idconsultorio}
                            className="form-check-input mt-0"
                            {...register("nuevos_consultorios")}
                          />
                          <label
                            htmlFor={`nuevocons_${consultorio_faltante.idconsultorio}`}
                            className="form-check-label fw-semibold"
                          >
                            {consultorio_faltante.nombre}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top border-light">
                <Link
                  to={`/admin/postas/${idposta}`}
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

export default EditarPosta;
