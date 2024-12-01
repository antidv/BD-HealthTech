import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getConsultorios } from "../../api/consultorios";
import { createPostaConsultorios } from "../../api/postas";
import Modal from "../../components/Modal";

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
        message: `La posta ${data.nombre} se ha creado con éxito.`,
      });
      console.log("Posta creada con éxito:", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: "Error: No se pudo crear la posta. Inténtalo de nuevo.",
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

  if (isLoading) return <b>Cargando ...</b>;
  if (isError) return <b>Ocurrió un error</b>;

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
            <h2 className="m-3">Registrar nueva posta</h2>
          </div>
        </div>

        <div className="row m-3">
          <form onSubmit={onSubmit}>
            <div className="row m-3">
              <div className="col-6 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
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

              <div className="col-6 mb-3">
                <label htmlFor="ciudad" className="form-label">
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  type="text"
                  className="form-control"
                  {...register("ciudad", {
                    required: "La ciudad es obligatoria",
                  })}
                />
                {errors.ciudad && <p>{errors.ciudad.message}</p>}
              </div>
            </div>

            <div className="row m-3">
              <div className="col-6 mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  className="form-control"
                  {...register("direccion", {
                    required: "La dirección es obligatoria",
                  })}
                />
                {errors.direccion && <p>{errors.direccion.message}</p>}
              </div>

              <div className="col-6 mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="text"
                  className="form-control"
                  {...register("telefono", {
                    pattern: {
                      value: /^\d{7}$/,
                      message: "Ingrese un teléfono válido",
                    },
                  })}
                />
                {errors.telefono && <p>{errors.telefono.message}</p>}
              </div>
            </div>

            <div className="row m-3">
              <div className="col-12 mb-3">
                <h4>Consultorios disponibles</h4>
              </div>
              {consultorios.map((consultorio) => (
                <div className="col-3 mb-3">
                  <div key={consultorio.idconsultorio} className="form-check">
                    <input
                      type="checkbox"
                      value={consultorio.idconsultorio}
                      className="form-check-input"
                      {...register("consultorios")}
                    />
                    <label className="form-check-label">
                      {consultorio.nombre}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="row m-3">
              <div className="col-12 d-flex justify-content-end">
                <Link to="/admin/postas" className="btn btn-secondary me-3">
                  Volver
                </Link>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="btn btn-primary"
                >
                  {mutation.isPending ? "Registrando..." : "Registrar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrarPosta;
