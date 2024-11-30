function CardMedico(props) {
  return (
    <div className="col-4 justify-content-center">
      <div className="card">
        <div className="d-flex justify-content-center">
          <img src={props.foto} className="card-img-top imageCard" alt="medico"  />
        </div>
        <div className="card-body">
          <h5 className="card-title">{props.nombre}</h5>
          <p className="card-text">{props.especialidad}</p>
        </div>
        <div className="card-body">
          <a href={`/admin/medicos/${props.id}`} className="card-link btn btn-warning">
            Ver
          </a>
          <a href="#" className={`card-link btn ${props.estado ? "btn-danger" : "btn-success"}`}>
            {props.estado ? "Deshabilitar" : "Habilitar"}
          </a>
        </div>
      </div>
    </div>
  );
}

export default CardMedico;