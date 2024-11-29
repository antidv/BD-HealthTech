function CardPosta(props) {
  return (
    <div className="card">
      <img src={props.foto} className="card-img-top" alt="posta" />
      <div className="card-body">
        <h5 className="card-title">{props.nombre}</h5>
        <p className="card-text">{props.ciudad}</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{props.direccion}</li>
      </ul>
      <div className="card-body">
        <a href={`/admin/postas/${props.id}`} className="card-link">
          Ver
        </a>
        <a href="#" className="card-link">
          {props.estado ? "Deshabilitar" : "Habilitar"}
        </a>
      </div>
    </div>
  );
}

export default CardPosta;
