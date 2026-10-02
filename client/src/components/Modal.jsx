function Modal({ estado, titulo, mensaje, setModal, onClose }) {
  const handleClose = () => {
    setModal({ show: false, estado: true, titulo: "", mensaje: "" });
    if (onClose) {
      onClose();
    }
  };

  const isSuccess = Boolean(estado);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
      }}
    >
      <div className="modal-dialog modal-dialog-centered fade-in-scale">
        <div className={`modal-content shadow-lg ${isSuccess ? "modal-success" : "modal-error"}`}>
          <div className="modal-header d-flex align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i
                className={`bi ${
                  isSuccess
                    ? "bi-check-circle-fill text-success fs-4"
                    : "bi-exclamation-triangle-fill text-danger fs-4"
                }`}
              ></i>
              <h5 className="modal-title fw-bold mb-0">
                {titulo || (isSuccess ? "Operación exitosa" : "Error")}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body py-4">
            <p className="mb-0 text-secondary fs-6">{mensaje}</p>
          </div>
          <div className="modal-footer bg-light bg-opacity-50">
            <button
              type="button"
              className="btn btn-secondary px-4 fw-semibold"
              onClick={handleClose}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
