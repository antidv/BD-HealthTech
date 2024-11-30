function Loading(props) {
  return (
    <>
      <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
        <h1>Cargando {props.nombre}</h1>
      </div>
    </>
  );
}

export default Loading;