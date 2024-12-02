import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProgracionCita,
  getDataProgramarCita,
  getHorarios,
} from "../../api/citas";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Modal from "../../components/Modal";
import { useState } from "react";

function ProgramarCita() {
  const { idconsultorio_posta } = useParams();
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
    isLoading: isDataLoad,
    isError: isDataError,
  } = useQuery({
    queryKey: ["data-cita", idconsultorio_posta],
    queryFn: () => getDataProgramarCita(idconsultorio_posta),
  });

  // Peticion de horarios
  const {
    data: horarios,
    isLoading: isHoraLoad,
    isError: isHoraError,
  } = useQuery({
    queryKey: ["horarios"],
    queryFn: getHorarios,
  });

  // Registrar
  const mutation = useMutation({
    mutationFn: (data) => createProgracionCita(data),
    onSuccess: (data) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Creación exitosa",
        message: "La cita se ha programado con exito",
      });
      console.log("La cita ha sido programada con exito: ", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrio un error",
        message: `Error: No se pudo programar la cita. ${error.response.data.error}`,
      });
      console.log("Hubo un error al programar la cita: ", error);
    },
  });

  // Manejo del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate(`/admin/programacion-citas`);
    }
  };

  if (isDataLoad || isHoraLoad) return <Loading nombre="datos de cita ..." />;
  if (isDataError || isHoraError)
    return <ErrorPage code={500} message={"Ocurrió un error"} />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-12">
            <h1 className="m-3">Programar cita</h1>
          </div>
          <div className="col-4">
            <div className="card m-5 cardConsultorioMedico">
              <div className="card-body">
                <h4>Posta</h4>
                <p>{data?.posta?.nombre}</p>
                <h4>Consultorio</h4>
                <p>{data?.consultorio?.nombre}</p>
              </div>
            </div>
          </div>
          <div className="col-8">
            {data?.doctores?.length === 0 ? (
              <p>No existen doctores disponibles para programar una cita</p>
            ) : (
              <div className="row m-3">
                {modal.show && (
                  <Modal
                    titulo={modal.titulo}
                    estado={modal.estado}
                    mensaje={modal.message}
                    setModal={setModal}
                    onClose={handleModalClose}
                  />
                )}
                <form onSubmit={onSubmit}>
                  <div className="row m-3">
                    <div className="col-6 mb-3">
                      <h4>Doctores</h4>
                      <select
                        className="form-select"
                        {...register("idmedconposta", {
                          required: "El doctor es requerido",
                        })}
                      >
                        <option value="">Seleccione un doctor</option>
                        {data?.doctores?.map((doctor) => (
                          <option
                            key={doctor.iddoctor}
                            value={doctor.idconsultorio_medico_posta}
                          >
                            {doctor.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.idmedconposta && (
                        <p className="invalid-feedback">
                          {errors.idmedconposta.message}
                        </p>
                      )}
                    </div>
                    <div className="col-6 mb-3">
                      <h4>Horarios</h4>
                      <select
                        className="form-select"
                        {...register("idhorario", {
                          required: "El horario es requerido",
                        })}
                      >
                        <option value="">Seleccione un horario</option>
                        {horarios?.map((horario) => (
                          <option
                            key={horario.idhorario}
                            value={horario.idhorario}
                          >
                            {horario.hora}
                          </option>
                        ))}
                      </select>
                      {errors.idhorario && (
                        <p className="invalid-feedback">
                          {errors.idhorario.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row m-3">
                    <div className="col-6 mb-3">
                      <h4>Calendario</h4>
                      <input
                        type="date"
                        className="form-control"
                        {...register("fecha", {
                          required: "La fecha es requerida",
                          validate: {
                            futureDate: (value) => {
                              const today = new Date()
                                .toISOString()
                                .split("T")[0]; // Obtiene la fecha de hoy en formato 'YYYY-MM-DD'
                              if (value <= today) {
                                return "La fecha debe ser posterior al día de hoy";
                              }
                              return true;
                            },
                          },
                        })}
                      />
                      {errors.fecha && (
                        <p className="invalid-feedback">{errors.fecha.message}</p>
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <h4>Cupos disponibles</h4>
                      <input
                        type="number"
                        className="form-control"
                        {...register("cupos_totales", {
                          required: "Ingrese los cupos de la cita",
                          min: {
                            value: 1,
                            message: "El número de cupos debe ser mayor que 0",
                          },
                          max: {
                            value: 20,
                            message:
                              "El número de cupos no puede ser mayor a 20",
                          },
                        })}
                      />
                      {errors.cupos_totales && (
                        <p className="invalid-feedback">
                          {errors.cupos_totales.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row m-3">
                    <div className="col-12 d-flex justify-content-end">
                      <Link
                        to={`/admin/postas/${data?.posta?.idposta}`}
                        className="btn btn-secondary me-3"
                      >
                        Volver
                      </Link>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Programando ..." : "Programar"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProgramarCita;
