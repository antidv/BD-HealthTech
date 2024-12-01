import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getPosta, updateConsultoriosPosta } from "../../api/postas";
import { getConsultoriosPosta } from "../../api/consultorios";
import { getConsultoriosFaltantesPosta } from "../../api/consultorios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Modal from "../../components/Modal";
import { useState } from "react";

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
    mutationFn: (data) => updateConsultoriosPosta(idposta, data),
    onSuccess: (data) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Actualizacion exitosa",
        message: `La posta se ha actualizado con éxito.`,
      });
      console.log("Posta actualizada: ", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrio un error",
        message: "Error: No se pudo actualizar la posta.",
      });
      console.error("Error al actualizar: ", error);
    },
  });

  //Manejo del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      ciudad: "",
      direccion: "",
      telefono: "",
      consultorios: [],
      nuevos_consultorios: [],
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      // Navegar solo si la operación fue exitosa
      navigate("/admin/postas");
    }
  };

  if (isPostaLoading || isConsultoriosLoading || isConsultoriosFaltantesLoading)
    return <Loading nombre="posta y consultorios ..." />;
  if (isPostaError || isConsultoriosError || isConsultoriosFaltantesError)
    return <ErrorPage code={500} message="Ocurrió un error ..." />;

  // Establecer valores del form
  if (posta) {
    setValue("nombre", posta.nombre);
    setValue("ciudad", posta.ciudad);
    setValue("direccion", posta.direccion);
    setValue("telefono", posta.telefono);
    setValue("estado", posta.disponible);
  }

  return (
    <>
      {/* Modal */}
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
          <h2 className="m-3">Editar posta</h2>
        </div>
      </div>
      {/* Dato de posta */}
      <div>
        <h2>{posta.nombre}</h2>
        <img src={posta.foto} alt="posta" width={200} />
        <p>{posta.ciudad}</p>
        <p>{posta.direccion}</p>
      </div>
      {/* Formulario */}
      <form onSubmit={onSubmit}>
        <div className="row">
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

        <div className="row">
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
                  message: "Ingrese un telefono valido",
                },
              })}
            />
            {errors.telefono && <p>{errors.telefono.message}</p>}
          </div>
          <div>
            <label htmlFor="estado">Estado</label>
            <input type="checkbox" id="estado" {...register("estado")} />
          </div>
        </div>
        <div className="col-12">
          <h4>Consultorios de la posta</h4>
        </div>
        {consultorios?.data?.length === 0 ? (
          <p>La posta no tiene consultorios</p>
        ) : (
          consultorios?.data?.map((consultorio, index) => (
            <div key={consultorio.idconsultorio} className="col-3 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  id={`consultorios.${index}.disponible`}
                  className="form-check-input"
                  defaultChecked={consultorio.disponible}
                  {...register(`consultorios.${index}.disponible`)}
                />
                <label
                  htmlFor={`consultorios.${index}.disponible`}
                  className="form-check-label"
                >
                  {consultorio.consultorio_nombre}
                </label>
                <input
                  type="hidden"
                  value={consultorio.idconsultorio}
                  {...register(`consultorios.${index}.idconsultorio`)}
                />
              </div>
            </div>
          ))
        )}
        <div className="col-12">
          <h4>Consultorios faltantes la posta</h4>
        </div>
        {consultoriosFaltantes?.length === 0 ? (
          <p>La posta tiene todos los consultorios disponibles</p>
        ) : (
          consultoriosFaltantes?.map((consultorio_faltante) => (
            <div
              className="col-3 mb-3"
              key={consultorio_faltante.idconsultorio}
            >
              <div className="form-check">
                <input
                  type="checkbox"
                  value={consultorio_faltante.idconsultorio}
                  className="form-check-input"
                  {...register("nuevos_consultorios")}
                />
                <label className="form-check-label">
                  {consultorio_faltante.nombre}
                </label>
              </div>
            </div>
          ))
        )}
        <div>
          <button type="submit">Actualizar</button>
        </div>
      </form>
    </>
  );
}

export default EditarPosta;
