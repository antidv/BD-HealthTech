import CardMedicoVistaM from "../../components/cards/CardMedicoVistaM";

function MedicoPrincipal(){
    return(
        <>
            <div className="container-fluid containerColor">
                <div className="row justify-content-center">
                    <div className="col-4 justify-content-center">
                        {/* Dato de medico */}
                        <CardMedicoVistaM />
                    </div>
                    <div className="col-8">
                        <div className="row mt-5 me-5">
                            <div className="col-12">
                                <h2 className="mb-3">Mis pacientes</h2>
                            </div>
                        </div>
                        <div className="row mt-2 me-5">
                            <div className="col-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Enmanuel Jose Obando Salinas</h5>
                                        <p className="card-text">Género: Masculino</p>
                                        <p className="card-text">Última cita: 30/11/2024</p>
                                        <div className="row">
                                            <div className="col-12 d-flex justify-content-end">
                                                <button className="btn btn-primary">Ver paciente</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Doble para acomodar cards */}
                            <div className="col-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Enmanuel Jose Obando Salinas</h5>
                                        <p className="card-text">Género: Masculino</p>
                                        <p className="card-text">Última cita: 30/11/2024</p>
                                        <div className="row">
                                            <div className="col-12 d-flex justify-content-end">
                                                <button className="btn btn-primary">Ver paciente</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default MedicoPrincipal;