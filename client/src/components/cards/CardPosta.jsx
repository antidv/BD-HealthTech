function CardPosta({
  id,
  foto,
  nombre,
  ciudad,
  direccion,
  estado,
  link = true, // Valor predeterminado de `link`
}) {
  return (
    <div className="col-4 justify-content-center">
      <div className="card mb-4">
        <div className="d-flex justify-content-center">
          <img src={foto} className="card-img-top imageCard" alt="posta" />
        </div>
        <div className="card-body">
          <h5 className="card-title">{nombre}</h5>
          <p className="card-text">{ciudad}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">{direccion}</li>
        </ul>
        {link && ( // Mostrar este bloque solo si `link` es true
          <div className="card-body">
            <a
              href={`/admin/postas/${id}`}
              className="card-link btn btn-warning"
            >
              Ver
            </a>
            <a
              href="#"
              className={`card-link btn ${
                estado ? "btn-danger" : "btn-success"
              }`}
            >
              {estado ? "Deshabilitar" : "Habilitar"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardPosta;
