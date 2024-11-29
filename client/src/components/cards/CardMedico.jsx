function CardMedico(props) {
  return (
    <div className="card">
      <img src={props.foto} alt="medico" className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{props.nombre}</h5>
        <p className="card-text">{props.especialidad}</p>
      </div>
      <div className="card-body">
        <a href={`/admin/medicos/${props.id}`} className="card-link">
          Ver
        </a>
        <a href="#" className="card-link">
          {props.estado ? "Deshabilitar" : "Habilitar"}
        </a>
      </div>
    </div>
  );
}

export default CardMedico;
