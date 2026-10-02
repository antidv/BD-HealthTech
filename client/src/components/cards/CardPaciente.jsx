import FotoPaciente from "../../assets/paciente.png";

function CardPaciente(props) {
  return (
    <div className="card shadow-sm mx-auto my-3 cardPaciente border-0">
      <div className="imageCardWrapper text-center pt-4">
        <img
          src={FotoPaciente}
          className="imageCard rounded-circle shadow-sm"
          alt="paciente"
          style={{ width: "110px", height: "110px" }}
        />
      </div>
      <div className="card-body p-4">
        <h4 className="card-title text-center fw-bold mb-3">{props.nombre}</h4>

        <div className="d-flex flex-column gap-2 text-secondary">
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span className="fw-semibold text-dark"><i className="bi bi-card-heading me-1 text-primary"></i> DNI</span>
            <span>{props.dni}</span>
          </div>
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span className="fw-semibold text-dark"><i className="bi bi-gender-ambiguous me-1 text-primary"></i> Género</span>
            <span>{props.genero}</span>
          </div>
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span className="fw-semibold text-dark"><i className="bi bi-cake2 me-1 text-primary"></i> F. Nacimiento</span>
            <span>{props.fecha_nacimiento}</span>
          </div>
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span className="fw-semibold text-dark"><i className="bi bi-geo-alt me-1 text-primary"></i> Ciudad</span>
            <span>{props.ciudad}</span>
          </div>
          <div className="d-flex justify-content-between pt-1">
            <span className="fw-semibold text-dark"><i className="bi bi-pin-map me-1 text-primary"></i> Dirección</span>
            <span className="text-end small">{props.direccion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPaciente;
