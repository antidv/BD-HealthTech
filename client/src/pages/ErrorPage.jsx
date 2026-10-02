function ErrorPage({ code, message }) {
  return (
    <div
      className="containerColor d-flex flex-column align-items-center justify-content-center p-4"
      style={{ minHeight: "calc(100vh - 65px)" }}
    >
      <div className="card text-center p-5 border-0 shadow-lg fade-in-scale" style={{ maxWidth: "520px" }}>
        <div className="mb-3">
          <i className="bi bi-exclamation-octagon text-danger display-1"></i>
        </div>
        <h1 className="fw-bold text-dark mb-2">Error {code || "404"}</h1>
        <p className="text-muted fs-6 mb-4">{message || "Página no encontrada o no disponible."}</p>
        <a href="/" className="btn btn-primary px-4 py-2 mx-auto">
          <i className="bi bi-house-door me-2"></i>
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;
