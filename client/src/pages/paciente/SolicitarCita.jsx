import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { createCitaPaciente, getDataCreateCitaPaciente } from "../../api/citas";
import Modal from "../../components/Modal";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function SolicitarCita() {
  const { idprogramacion_cita } = useParams();

  const [modal, setModal] = useState({
    show: false,
    estado: true,
    titulo: "",
    message: "",
  });

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

  const mutation = useMutation({
    mutationKey: ["crear-cita"],
    mutationFn: createCitaPaciente,
    onSuccess: () => {
      setModal({
        show: true,
        estado: true,
        titulo: "Reserva exitosa",
        message: "Tu cita médica ha sido solicitada con éxito.",
      });
    },
    onError: (error) => {
      setModal({
        show: true,
        estado: false,
        titulo: "Error al solicitar",
        message: error.response?.data?.error || "No se pudo registrar la cita.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const datosEnviar = {
      idprogramacion_cita: cita.idprogramacion_cita,
      idmedico: cita.idmedico,
      motivo,
      fecha: cita.fecha,
      consultorio: cita.consultorio,
    };
    mutation.mutate(datosEnviar);
  };

  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.estado) {
      navigate("/paciente/citas");
    }
  };

  if (isLoading) return <Loading nombre="programación de cita..." />;
  if (isError) return <ErrorPage code={500} message="No se pudo cargar la cita seleccionada" />;

  return (
    <div className="containerColor py-4">
      {modal.show && (
        <Modal
          titulo={modal.titulo}
          estado={modal.estado}
          mensaje={modal.message}
          setModal={setModal}
          onClose={handleModalClose}
        />
      )}

      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1">Confirmar Cita Médica</h1>
            <p className="text-muted small mb-0">Revisa los datos de atención y describe tu motivo</p>
          </div>
          <Link to="/paciente/citas-disponibles" className="btn btn-secondary shadow-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver
          </Link>
        </div>

        <div className="card border-0 shadow-sm p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <fieldset disabled={mutation.isPending}>
              {/* Información fija de la programación */}
              <div className="row g-3 mb-4 p-3 bg-light rounded-3">
                <div className="col-12 col-md-4">
                  <span className="text-muted small d-block">Fecha</span>
                  <span className="fw-semibold text-dark">
                    <i className="bi bi-calendar-check me-1 text-primary"></i>
                    {cita.fecha}
                  </span>
                </div>
                <div className="col-12 col-md-4">
                  <span className="text-muted small d-block">Horario</span>
                  <span className="fw-semibold text-dark">
                    <i className="bi bi-clock me-1 text-primary"></i>
                    {cita.hora}
                  </span>
                </div>
                <div className="col-12 col-md-4">
                  <span className="text-muted small d-block">Centro de salud</span>
                  <span className="fw-semibold text-dark">
                    <i className="bi bi-buildings me-1 text-primary"></i>
                    {cita.posta}
                  </span>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-muted small d-block">Consultorio</span>
                  <span className="badge bg-white text-dark border px-3 py-2 mt-1">
                    {cita.consultorio}
                  </span>
                </div>
                <div className="col-12 col-md-6">
                  <span className="text-muted small d-block">Médico asignado</span>
                  <span className="fw-semibold text-dark">
                    <i className="bi bi-person-badge me-1 text-primary"></i>
                    {cita.nombre}
                  </span>
                </div>
              </div>

              {/* Motivo editable */}
              <div className="mb-4">
                <label className="form-label fw-bold" htmlFor="motivo">
                  Motivo de la consulta
                </label>
                <textarea
                  id="motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  required
                  rows="3"
                  className="form-control"
                  placeholder="Describe brevemente tus síntomas o el motivo de tu atención..."
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link to="/paciente/citas-disponibles" className="btn btn-secondary px-4">
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="btn btn-warning px-4 fw-bold shadow-sm"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Reservando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i>
                      Confirmar Cita
                    </>
                  )}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SolicitarCita;
