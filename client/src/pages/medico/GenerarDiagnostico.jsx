import { Link } from "react-router-dom";
import CardPaciente from "../../components/cards/CardPaciente";

function GenerarDiagnostico() {
  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-4 justify-content-center">
            {/* Dato de medico */}
            <CardPaciente
              nombre="Enmanuel Obando"
              dni="12345678"
              genero="Masculino"
              fecha_nacimiento="19/07/2004"
              direccion="Calle 123"
              ciudad="Lima"
            />
          </div>
          <div className="col-8 mb-5">
            <div className="row mt-2 me-5">
              <div className="col-12 mt-5 me-5">
                <h2 className="mb-4">Generar diagnóstico</h2>
                <button className="btn btn-primary">Agregar</button>
                <div className="row">
                  <div className="col-4 mt-4">
                    <div className="card">
                      <div className="card-body">
                        <form>
                          <div className="row">
                            <div className="col-12">
                              <label
                                htmlFor="diagnostico"
                                className="form-label mt-2"
                              >
                                Diagnóstico
                              </label>
                              <input
                                id="diagnostico"
                                type="text"
                                className="form-control"
                              />
                            </div>
                            <div className="col-12">
                              <label
                                htmlFor="medicamento"
                                className="form-label mt-2"
                              >
                                Medicamento
                              </label>
                              <select className="form-select">
                                <option selected>Medicamento</option>
                                <option value="1">Med1</option>
                                <option value="2">Med2</option>
                                <option value="3">Med3</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label
                                htmlFor="dosis"
                                className="form-label mt-2"
                              >
                                Dosis
                              </label>
                              <input
                                id="dosis"
                                type="text"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Paginacion 
                            <Pagination
                            currentPage={page}
                            totalPages={citas.totalPages}
                            onPageChange={setPage}
                            /> */}
              </div>
            </div>
            <div className="row mt-2 me-5">
              <div className="col-12 mt-3 me-5">
                <h3>Antecedentes médicos</h3>
              </div>
              <div className="col-12 mt-3 me-5">
                <h4 className="mb-4">Alergias</h4>
                <div className="row">
                  <div className="col-2 d-flex">
                    <input
                      type="checkbox"
                      id="alergia"
                      className="me-2 form-check"
                    />
                    <label htmlFor="alergia" className="form-label">
                      Alergia1
                    </label>
                  </div>
                  {/* Repetición para ver las columnas */}
                  <div className="col-2 d-flex">
                    <input
                      type="checkbox"
                      id="alergia"
                      className="me-2 form-check"
                    />
                    <label htmlFor="alergia" className="form-label">
                      Alergia1
                    </label>
                  </div>
                  <div className="col-2 d-flex">
                    <input
                      type="checkbox"
                      id="alergia"
                      className="me-2 form-check"
                    />
                    <label htmlFor="alergia" className="form-label">
                      Alergia1
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-3 me-5">
                <h4 className="mb-4">Enfermedades</h4>
                <div className="row">
                  <div className="col-2 d-flex">
                    <input
                      type="checkbox"
                      id="alergia"
                      className="me-2 form-check"
                    />
                    <label htmlFor="alergia" className="form-label">
                      Alergia1
                    </label>
                  </div>
                  {/* Repetición para ver las columnas */}
                  <div className="col-2 d-flex">
                    <input
                      type="checkbox"
                      id="alergia"
                      className="me-2 form-check"
                    />
                    <label htmlFor="alergia" className="form-label">
                      Alergia1
                    </label>
                  </div>
                  <div className="col-2 d-flex">
                    <input
                      type="checkbox"
                      id="alergia"
                      className="me-2 form-check"
                    />
                    <label htmlFor="alergia" className="form-label">
                      Alergia1
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2 me-5">
              <div className="col-12 d-flex justify-content-end">
                <Link to={``} className="btn btn-secondary me-3">
                  Volver
                </Link>
                <button type="submit" className="btn btn-primary">
                  Generar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GenerarDiagnostico;
