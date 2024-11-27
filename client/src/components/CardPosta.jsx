function CardPosta(props) {
  return (
    <div className="col-4 justify-content-center">
      <div class="card">
        <img src={props.foto} class="card-img-top text-center" alt="posta" />
        <div class="card-body">
          <h5 class="card-title">{props.nombre}</h5>
          <p class="card-text">{props.ciudad}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">{props.direccion}</li>
        </ul>
        <div class="card-body">
          <a href="#" class="card-link btn btn-warning">
            Ver
          </a>
          <a href="#" class="card-link btn btn-danger">
            Eliminar
          </a>
        </div>
      </div>
    </div>
    
    
    
  );
}

export default CardPosta;
