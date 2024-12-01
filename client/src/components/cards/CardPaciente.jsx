function CardMedico(props) {
    return (
      <div className="col-4 justify-content-center">
        <div className="card">
          <div className="d-flex justify-content-center">
            <img src={props.foto} className="card-img-top imageCard" alt="paciente"  />
          </div>
          <div className="card-body">
            <h5 className="card-title">{props.nombre}</h5>
            <p className="card-text">{props.especialidad}</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default CardPaciente;
  