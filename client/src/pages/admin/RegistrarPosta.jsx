import React from "react";
import { useForm } from "react-hook-form";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import axios from "axios";

const RegistrarPosta = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      consultorios: [],
    },
  });

  // // Fetch consultorios disponibles
  // const { data: consultorios, isLoading } = useQuery(
  //   ["consultorios"],
  //   async () => {
  //     const response = await axios.get("/api/consultorios");
  //     return response.data;
  //   }
  // );

  // // Registrar nueva posta y consultorios asociados
  // const mutation = useMutation((data) => axios.post("/api/postas", data), {
  //   onSuccess: () => {
  //     alert("Posta registrada con éxito");
  //     reset();
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     alert("Hubo un error al registrar la posta");
  //   },
  // });

  const onSubmit = handleSubmit((data) => {
    //mutation.mutate(data);
    console.log("Data entregada: ", data);
  });

  // if (isLoading) return <p>Cargando consultorios...</p>;
  // if (isError) return <p>Cargando consultorios...</p>;

  return (
    <>
      <h2>Registrar Nueva Posta</h2>
      <form onSubmit={onSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            {...register("nombre", {
              required: "El nombre es obligatorio",
            })}
          />
          {errors.nombre && <p>{errors.nombre.message}</p>}
        </div>

        <div>
          <label>Ciudad</label>
          <input
            type="text"
            {...register("ciudad", {
              required: "La ciudad es obligatoria",
            })}
          />
          {errors.ciudad && <p>{errors.ciudad.message}</p>}
        </div>

        <div>
          <label>Dirección</label>
          <input
            type="text"
            {...register("direccion", {
              required: "La dirección es obligatoria",
            })}
          />
          {errors.direccion && <p>{errors.direccion.message}</p>}
        </div>

        <div>
          <label>Teléfono</label>
          <input
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
          <div>
            <input type="checkbox" value={1} {...register("consultorios")} />
            <label>consultorio 1</label>
          </div>
          <div>
            <input type="checkbox" value={2} {...register("consultorios")} />
            <label>consultorio 2</label>
          </div>
          <div>
            <input type="checkbox" value={3} {...register("consultorios")} />
            <label>consultorio 3</label>
          </div>
          {/* {consultorios.map((consultorio) => (
          <div key={consultorio.idconsultorio}>
            <input
              type="checkbox"
              value={consultorio.idconsultorio}
              {...register("consultorios")}
            />
            <label>{consultorio.nombre}</label>
          </div>
        ))} */}
        </div>

        <button type="submit">Registrar</button>
      </form>
    </>
  );
};

export default RegistrarPosta;
