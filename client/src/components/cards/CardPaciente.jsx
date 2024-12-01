import FotoPaciente from "../../assets/paciente.png";

function CardPaciente(props) {
  return (
    <div className="card m-5 cardPaciente">
      <h2 className="m-3 text-center">Enmanuel Jose Obando Salinas</h2>
      <div className="d-flex justify-content-center">
        <img
          src={FotoPaciente}
          className="card-img-top imageCard"
          alt="paciente"
        />
      </div>
      <div className="card-body">
        <p className="card-text">Género: Masculino</p>
        <p className="card-text">Fecha de nacimiento: 19/07/2004</p>
      </div>
    </div>
  );
}

export default CardPaciente;
