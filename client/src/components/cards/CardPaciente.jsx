import FotoPaciente from "../../assets/paciente.png";

function CardPaciente(props) {
  return (
    <div className="card m-5 cardPaciente">
      <h2 className="m-3 text-center">{props.nombre}</h2>
      <div className="d-flex justify-content-center">
        <img
          src={FotoPaciente}
          className="card-img-top imageCard"
          alt="paciente"
        />
      </div>
      <div className="card-body">
        <p className="card-text">
          <b>DNI: </b>
          {props.dni}
        </p>
        <p className="card-text">
          <b>Género: </b>
          {props.genero}
        </p>
        <p className="card-text">
          <b>Fecha de nacimiento: </b>
          {props.fecha_nacimiento}
        </p>
        <p className="card-text">
          <b>Dirección: </b>
          {props.direccion}
        </p>
        <p className="card-text">
          <b>Ciudad: </b>
          {props.ciudad}
        </p>
      </div>
    </div>
  );
}

export default CardPaciente;
