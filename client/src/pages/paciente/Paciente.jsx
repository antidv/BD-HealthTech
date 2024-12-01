import CardPaciente from "../../components/cards/CardPaciente";

function Paciente(props){
    return(
        <>
            <div className="container-fluid containerColor">
                <div className="row align-items-center justify-content-center">
                    <div className="col-12">
                        <h1 className="m-3">Bienvenido, {props.nombre}</h1>
                    </div>
                </div>

                <div className="row m-3">
                    <CardPaciente />
                </div>
            </div>
        </>
    )
}

export default Paciente;