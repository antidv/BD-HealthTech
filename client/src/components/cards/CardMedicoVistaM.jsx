function CardMedicoVistaM(props) {
  return (
    <div className="card shadow-sm mx-auto my-3 cardMedico border-0">
      <div className="imageCardWrapper text-center pt-4 position-relative">
        <img
          src={props.foto}
          className="imageCard rounded-circle shadow-sm"
          alt="medico"
          style={{ width: "110px", height: "110px" }}
        />
        <span
          className={`position-absolute top-0 end-0 m-3 badge-status ${
            props.disponible ? "habilitado" : "deshabilitado"
          }`}
        >
          <i
            className={`bi ${
              props.disponible ? "bi-check-circle-fill" : "bi-x-circle-fill"
            }`}
          ></i>
          {props.disponible ? "Disponible" : "No disponible"}
        </span>
      </div>
      <div className="card-body p-4">
        <h4 className="card-title text-center fw-bold mb-3">{props.nombre}</h4>

        <div className="d-flex flex-column gap-2 text-secondary">
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span className="fw-semibold text-dark">
              <i className="bi bi-award me-1 text-primary"></i> Especialidad
            </span>
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-1 rounded-pill">
              {props.especialidad}
            </span>
          </div>
          <div className="d-flex justify-content-between pt-1">
            <span className="fw-semibold text-dark">
              <i className="bi bi-card-heading me-1 text-primary"></i> DNI
            </span>
            <span>{props.dni}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardMedicoVistaM;
