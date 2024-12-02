import { useQuery } from "@tanstack/react-query";
import { getAntecedentesPaciente } from "../../api/paciente";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";

function Antecedentes() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["antecedentes"],
    queryFn: () => getAntecedentesPaciente(),
  });

  if (isLoading) return <Loading nombre="antecedentes ..." />;
  if (isError) return <ErrorPage code={500} message="Ocurrió un error ..." />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row align-items-center justify-content-center">
          <div className="col-12">
            <div className="row">
              <h1 className="m-3">Antecedentes</h1>
              {data?.antecedentes?.length > 0 ? (
                data?.antecedentes?.map((antecedente) => (
                  <div key={antecedente.idantecedentes} className="row">
                    <div className="col-6">
                      <div className="card ms-5 me-5">
                        <h2 className="m-3">Enfermedades</h2>
                        <div className="card-body">
                          <ul className="list-group">
                            {antecedente?.enfermedades?.length > 0 ? (
                              antecedente?.enfermedades?.map((enfermedad, index) => (
                                <li key={index} className="list-group-item">{enfermedad}</li>
                              ))
                            ) : (
                              <p className="card-text">No hay enfermedades</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card ms-5 me-5">
                        <h2 className="m-3">Alergias</h2>
                        <div className="card-body">
                          <ul className="list-group">
                            {antecedente?.alergias?.length > 0 ? (
                              antecedente?.alergias?.map((alergia, index) => (
                                <li key={index} className="list-group-item">{alergia}</li>
                              ))
                            ) : (
                              <p className="card-text">No hay alergias</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay antecedentes disponibles.</p>
              )}
            </div>
            <div className="row me-5 mt-4">
              <div className="col-12 d-flex justify-content-end">
                <Link to="/paciente/citas" className="btn btn-secondary me-3">
                  Volver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default Antecedentes;
