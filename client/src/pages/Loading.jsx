function Loading(props) {
  return (
    <div className="containerColor d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
      <div className="card border-0 shadow-sm p-4 p-md-5 text-center fade-in-scale" style={{ maxWidth: "420px" }}>
        <div className="spinner-border text-primary mx-auto mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h5 className="fw-bold mb-1 text-dark">Cargando {props.nombre || "información"}</h5>
        <p className="text-muted small mb-0">Por favor, espera un momento...</p>
      </div>
    </div>
  );
}

export default Loading;
