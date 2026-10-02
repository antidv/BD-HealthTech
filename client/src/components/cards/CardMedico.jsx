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
    <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch">
      <div className={`card w-100 ${estado ? "" : "opacity-75"}`}>
        {/* Frame de imagen de médico */}
        <div className="imageCardWrapper position-relative">
          <img src={foto} className="imageCard rounded-circle" alt={nombre} />
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
            {estado ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="card-body d-flex flex-column text-center text-md-start">
          <h5 className="card-title fs-5 mb-1">{nombre}</h5>
          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-1 rounded-pill mb-3 align-self-start">
            <i className="bi bi-award me-1"></i>
            {especialidad}
          </span>

          <div className="mt-auto pt-3 border-top d-flex gap-2">
            <a
              href={`/admin/medicos/${idmedico}`}
              className="btn btn-warning flex-grow-1"
            >
              <i className="bi bi-eye me-1"></i>
              Ver
            </a>
            <button
              className={`btn flex-grow-1 ${estado ? "btn-danger" : "btn-success"}`}
              disabled={mutation.isPending}
              onClick={() => handleOnClick(idmedico)}
            >
              {mutation.isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  Actualizando...
                </>
              ) : estado ? (
                <>
                  <i className="bi bi-slash-circle me-1"></i>
                  Deshabilitar
                </>
              ) : (
                <>
                  <i className="bi bi-check2 me-1"></i>
                  Habilitar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardMedico;
