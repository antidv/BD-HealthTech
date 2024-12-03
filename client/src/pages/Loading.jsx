function Loading(props) {
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4 className="mt-3">Cargando {props.nombre}...</h4>
    </div>
  );
}

export default Loading;
