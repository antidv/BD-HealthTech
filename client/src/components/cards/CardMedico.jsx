function CardMedico({
  foto,
  nombre,
  especialidad,
  estado,
  idmedico,
  handleOnClick,
  mutation,
}) {
  return (
    <div className="col-4 justify-content-center">
      <div className="card mb-4">
        <div className="d-flex justify-content-center">
          <img src={foto} className="card-img-top imageCard" alt="medico" />
        </div>
        <div className="card-body">
          <h5 className="card-title">{nombre}</h5>
          <p className="card-text">{especialidad}</p>
        </div>
        <div className="card-body">
          <a
            href={`/admin/medicos/${idmedico}`}
            className="card-link btn btn-warning"
          >
            Ver
          </a>
          <button
            className={`card-link btn ${estado ? "btn-danger" : "btn-success"}`}
            disabled={mutation.isPending}
            onClick={() => handleOnClick(idmedico)}
          >
            {mutation.isPending
              ? "Cambiando ..."
              : estado
              ? "Deshabilitar"
              : "Habilitar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardMedico;
