import CardPaciente from "../../components/cards/CardPaciente";

function Paciente(props){
    return(
        <>
            <div className="container-fluid containerColor">
                <div className="row justify-content-center">
                    <div className="col-4 justify-content-center">
                        <CardPaciente />
                    </div>
                    <div className="col-8">
                        <div className="table-responsive mt-5 me-5">
                            <h2 className="mb-4">Mis citas</h2>
                            <table class="table table-info table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Hora</th>
                                        <th scope="col">Motivo</th>
                                        <th scope="col">Consultorio</th>
                                        <th scope="col">Médico</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Receta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">19/07/2024</th>
                                        <td>17:30</td>
                                        <td>Dolor de garganta</td>
                                        <td>Medicina General</td>
                                        <td>Juan Perez</td>
                                        <td>Completado</td>
                                        <td>
                                            <button className="btn btn-primary">Receta</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paciente;