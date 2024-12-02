import CardMedicoVistaM from "../../components/cards/CardMedicoVistaM";
import { Link } from "react-router-dom";

function MedicoPrincipal() {
  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-4 justify-content-center">
            {/* Dato de medico */}
            <CardMedicoVistaM />
          </div>
          <div className="col-8">
            <div className="row mt-2 me-5">
              <div className="col-12">
                <div className="table-responsive mt-5 me-5">
                  <h2 className="mb-4">Historial de citas</h2>
                  <table class="table table-info table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Motivo</th>
                        <th scope="col">Consultorio</th>
                        <th scope="col">Paciente</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">13/07/2024</th>
                        <td>17:30</td>
                        <td>Me duele</td>
                        <td>Medicina Genral</td>
                        <td>Enmanuel Obando</td>
                        <td>Completado</td>
                        <td>
                          <Link to={`/medico/diagnostico`} className={`btn btn-primary`}>
                            Modificar
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Paginacion 
                <Pagination
                currentPage={page}
                totalPages={citas.totalPages}
                onPageChange={setPage}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MedicoPrincipal;
