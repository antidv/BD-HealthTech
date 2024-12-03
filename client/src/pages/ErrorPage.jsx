function ErrorPage({ code, message }) {
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-5 border rounded shadow-sm bg-white">
        <h1 className="display-1 text-danger font-weight-bold">Error {code}</h1>
        <p className="lead text-muted">{message}</p>
        <a href="/" className="btn btn-primary mt-3">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;
