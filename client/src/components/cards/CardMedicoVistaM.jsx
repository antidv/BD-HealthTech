function CardMedicoVistaM(props) {
  return (
    <>
      <div className="card m-5 cardMedico">
        <h2 className="m-3 text-center">{props.nombre}</h2>
        <div className="d-flex justify-content-center">
          <img
            src={props.foto}
            className="card-img-top imageCard"
            alt="medico"
          />
        </div>
        <div className="card-body">
          <p className="card-text">
            <b>Especialidad: </b>
            {props.especialidad}
          </p>
          <p className="card-text">
            <b>DNI: </b>
            {props.dni}
          </p>
          <p className="card-text">
            <b>Estado: </b>
            {props.disponible ? "Diponible" : "No disponible"}
          </p>
        </div>
      </div>
    </>
  );
}

export default CardMedicoVistaM;
