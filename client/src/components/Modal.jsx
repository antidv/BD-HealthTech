function Modal({ estado, titulo, mensaje, setModal, onClose }) {
  const handleClose = () => {
    setModal({ show: false, estado: true, titulo: "", mensaje: "" });
    if (onClose) {
      onClose();
    }
  };

  // Establecer los estilos de acuerdo al estado (true o false)
  const modalClass = estado ? "modal-success" : "modal-error";
  const estadoTexto = estado ? "Operación exitosa" : "Algo salió mal";
  const estadoColor = estado ? "text-success" : "text-danger";

  return (
    <div
      className={`modal fade show d-block ${modalClass}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <b>{titulo}</b>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
            <p>
              <b>Resultado: </b>
              <span className={estadoColor}>{estadoTexto}</span>
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
