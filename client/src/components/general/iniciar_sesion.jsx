import LogoHealth from '../../assets/logo_ht.png';


export function IniciarSesion(){
    return(
        <>
            <div className="row">
                <div className="col-6">
                    <img src={LogoHealth} alt="Logo" />
                </div>
                <div className="col-6">
                    <h2>Iniciar sesión</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Correo electrónico</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Contraseña</label>
                            <input type="password" className="form-control" id="exampleInputPassword1"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </>
    )
}