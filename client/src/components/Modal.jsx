function Modal({ estado, titulo, mensaje, setModal, onClose }) {
  const handleClose = () => {
    setModal({ show: false, estado: true, titulo: "", message: "" });
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><b>{titulo}</b></h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
            <p><b>Estado: </b>{`${estado}`}</p>
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
