function CardMedicoVistaM(props) {
  return (
    <>
      <div className="card m-5 cardMedico">
        <h2 className="m-3 text-center">Juan Perez</h2>
        <div className="d-flex justify-content-center">
          <img
            src={props.foto}
            className="card-img-top imageCard"
            alt="medico"
          />
        </div>
        <div className="card-body">
          <p className="card-text">Género: Masculino</p>
          <p className="card-text">Consultorio: Medicina General</p>
        </div>
      </div>
    </>
  );
}

export default CardMedicoVistaM;
