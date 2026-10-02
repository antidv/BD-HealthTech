import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getConsultorios } from "../../api/consultorios";
import { createPostaConsultorios } from "../../api/postas";
import Modal from "../../components/Modal";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function RegistrarPosta() {
  // Estados del modal
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
  } = useForm({
    defaultValues: {
      consultorios: [],
    },
  });

  // Peticion de consultorios
  const {
    data: consultorios,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["consultorios"],
    queryFn: getConsultorios,
  });

  // Registrar nueva posta y consultorios asociados
  const mutation = useMutation({
    mutationFn: createPostaConsultorios,
    onSuccess: (data) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Registro exitoso",
        message: `La posta ${data.nombre} se ha registrado con éxito.`,
      });
      console.log("Posta creada con éxito:", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: "No se pudo registrar la posta médica. Inténtelo de nuevo.",
      });
      console.error("Error al crear la posta:", error);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate("/admin/postas");
    }
  };

  if (isLoading) return <Loading nombre="consultorios disponibles..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error al cargar los consultorios." />;

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
          <Link to="/admin/postas" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Postas
          </Link>
          <h2 className="mb-0 fw-bold">Registrar Nueva Posta Médica</h2>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <form onSubmit={onSubmit}>
              <fieldset disabled={mutation.isPending}>
                <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-light">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-hospital fs-5"></i>
                  </div>
                  <h5 className="fw-bold mb-0 text-primary">Datos del Establecimiento</h5>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="nombre" className="form-label fw-semibold small text-muted">
                      Nombre de la Posta
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Ej. Posta Médica Santa Anita"
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
                      Ciudad / Distrito
                    </label>
                    <input
                      id="ciudad"
                      type="text"
                      placeholder="Ej. Lima"
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
                      Dirección Completa
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      placeholder="Ej. Av. Los Eucaliptos 123"
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
                      Teléfono de Contacto
                    </label>
                    <input
                      id="telefono"
                      type="text"
                      placeholder="Ej. 987654321 o 4567890"
                      className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                      {...register("telefono", {
                        pattern: {
                          value: /^\d{7,9}$/,
                          message: "Ingrese un teléfono válido (7 a 9 dígitos)",
                        },
                      })}
                    />
                    {errors.telefono && (
                      <div className="invalid-feedback">{errors.telefono.message}</div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4 pb-2 mt-5 border-bottom border-light">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-door-open fs-5"></i>
                  </div>
                  <h5 className="fw-bold mb-0 text-primary">Consultorios Disponibles para Asociar</h5>
                </div>

                <div className="row g-3">
                  {consultorios?.map((consultorio) => (
                    <div key={consultorio.idconsultorio} className="col-12 col-md-4">
                      <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                        <input
                          type="checkbox"
                          id={`cons_${consultorio.idconsultorio}`}
                          value={consultorio.idconsultorio}
                          className="form-check-input mt-0"
                          {...register("consultorios")}
                        />
                        <label htmlFor={`cons_${consultorio.idconsultorio}`} className="form-check-label fw-semibold">
                          {consultorio.nombre}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top border-light">
                  <Link to="/admin/postas" className="btn btn-outline-secondary px-4">
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
                        <i className="bi bi-plus-circle me-1"></i> Registrar Posta
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

export default RegistrarPosta;
