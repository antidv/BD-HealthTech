function CardPosta({
  id,
  foto,
  nombre,
  ciudad,
  direccion,
  estado,
  link = true,
}) {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch">
      <div className={`card w-100 ${estado ? "" : "opacity-75"}`}>
        {/* Frame de imagen */}
        <div className="imageCardWrapper position-relative">
          <img src={foto} className="imageCard" alt={nombre} />
          <span
            className={`position-absolute top-0 end-0 m-3 badge-status ${
              estado ? "habilitado" : "deshabilitado"
            }`}
          >
            <i
              className={`bi ${
                estado ? "bi-check-circle-fill" : "bi-x-circle-fill"
              }`}
            ></i>
            {estado ? "Disponible" : "No disponible"}
          </span>
        </div>

        {/* Contenido de la tarjeta */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fs-5 mb-1">{nombre}</h5>
          <p className="card-text text-primary fw-semibold small mb-2 d-flex align-items-center gap-1">
            <i className="bi bi-geo-alt-fill text-danger"></i>
            {ciudad}
          </p>

          <p className="text-muted small mb-3 text-truncate" title={direccion}>
            <i className="bi bi-pin-map me-1"></i>
            {direccion}
          </p>

          {link && (
            <div className="mt-auto pt-3 border-top d-flex gap-2 justify-content-between">
              <a
                href={`/admin/postas/${id}`}
                className="btn btn-warning flex-grow-1"
              >
                <i className="bi bi-eye me-1"></i>
                Ver detalle
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardPosta;
