import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
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
    reset,
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
      navigate("/admin/postas");
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrio un error",
        message: "Error: No se pudo crear la posta. Inténtalo de nuevo.",
      });
      console.error("Error al crear la posta:", error);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
    reset();
  });

  if (isLoading) return <b>Cargando ...</b>;
  if (isError) return <b>Ocurrio un error</b>;

  return (
    <>
      {modal.show && (
        <Modal
          titulo={modal.titulo}
          estado={modal.estado}
          mensaje={modal.message}
          setModal={setModal}
        />
      )}
      <h2>Registrar Nueva Posta</h2>
      <form onSubmit={onSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            {...register("nombre", {
              required: "El nombre es obligatorio",
            })}
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>

        <div>
          <label htmlFor="ciudad">Ciudad</label>
          <input
            id="ciudad"
            type="text"
            {...register("ciudad", {
              required: "La ciudad es obligatoria",
            })}
          />
          {errors.ciudad && <p>{errors.ciudad.message}</p>}
        </div>

        <div>
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            type="text"
            {...register("direccion", {
              required: "La dirección es obligatoria",
            })}
          />
          {errors.direccion && <p>{errors.direccion.message}</p>}
        </div>

        <div>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="text"
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
          <h3>Consultorios Disponibles</h3>
          {consultorios.map((consultorio) => (
            <div key={consultorio.idconsultorio}>
              <input
                type="checkbox"
                value={consultorio.idconsultorio}
                {...register("consultorios")}
              />
              <label>{consultorio.nombre}</label>
            </div>
          ))}
        </div>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </>
  );
}

export default RegistrarPosta;
