import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { createCitaPaciente, getDataCreateCitaPaciente } from "../../api/citas";
import Modal from "../../components/Modal";

function SolicitarCita() {
  const { idprogramacion_cita } = useParams();

  // Estado del modal
  const [modal, setModal] = useState({
    show: false,
    estado: true,
    titulo: "",
    message: "",
  });

  // Navegacion
  const navigate = useNavigate();

  const {
    data: cita,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["programacion_cita", idprogramacion_cita],
    queryFn: () => getDataCreateCitaPaciente(idprogramacion_cita),
  });

  const [motivo, setMotivo] = useState("");

  // Crear cita
  const mutation = useMutation({
    mutationKey: ["crear-cita"],
    mutationFn: createCitaPaciente,
    onSuccess: (data) => {
      setModal({
        show: true,
        estado: true,
        titulo: "Registro exitoso",
        message: `La cita se ha creado con éxito.`,
      });
      console.log("Cita creada con éxito:", data);
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Ocurrió un error",
        message: `Error: No se pudo crear la cita. ${error.response.data.error}`,
      });
      console.error("Error al crear la cita:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Crear el objeto con los datos a enviar
    const datosEnviar = {
      idprogramacion_cita: cita.idprogramacion_cita,
      idmedico: cita.idmedico,
      motivo,
      fecha: cita.fecha,
      consultorio: cita.consultorio,
    };
    // Simular envío de datos
    mutation.mutate(datosEnviar);

    // Aquí puedes llamar a tu función de API para enviar los datos.
  };

  // Navegar al cerrar el modal
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate("/paciente/citas");
    }
  };

  if (isLoading) return <p>Cargando la programación...</p>;
  if (isError) return <p>Ocurrió un error...</p>;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <div>
              {modal.show && (
                <Modal
                  titulo={modal.titulo}
                  estado={modal.estado}
                  mensaje={modal.message}
                  setModal={setModal}
                  onClose={handleModalClose}
                />
              )}
              <h1 className="m-3">Solicitar cita</h1>
              <form onSubmit={handleSubmit}>
                {/* Mostrar los datos como inputs solo lectura */}
                <div className="row m-5">
                  <div className="col-4 mb-3">
                    <label className="form-label">Fecha:</label>
                    <input
                      type="text"
                      value={cita.fecha}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="col-4 mb-3">
                    <label className="form-label">Posta:</label>
                    <input
                      type="text"
                      value={cita.posta}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="col-4 mb-3">
                    <label className="form-label">Consultorio:</label>
                    <input
                      type="text"
                      value={cita.consultorio}
                      readOnly
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row ms-5 me-5">
                  <div className="col-4 mb-3">
                    <label className="form-label">Médico:</label>
                    <input
                      type="text"
                      value={cita.nombre}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="col-4 mb-3">
                    <label className="form-label">Horario:</label>
                    <input
                      type="text"
                      value={cita.hora}
                      readOnly
                      className="form-control"
                    />
                  </div>

                  {/* Campo editable para el motivo */}
                  <div className="col-4 mb-3">
                    <label className="form-label">Motivo de la cita:</label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      required
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="row ms-5 me-5">
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary mt-3"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending
                        ? "Solicitando ..."
                        : "Solicitar Cita"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SolicitarCita;
