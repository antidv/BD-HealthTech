import { useQuery } from "@tanstack/react-query";
import { getAntecedentesPaciente } from "../../api/paciente";
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
    <div>
      <h1>Antecedentes</h1>

      {data?.antecedentes?.length > 0 ? (
        data?.antecedentes?.map((antecedente) => (
          <div key={antecedente.idantecedentes}>
            <h2>Enfermedades</h2>
            <ul>
              {antecedente?.enfermedades?.length > 0 ? (
                antecedente?.enfermedades?.map((enfermedad, index) => (
                  <li key={index}>{enfermedad}</li>
                ))
              ) : (
                <p>No hay enfermedades</p>
              )}
            </ul>
            <h2>Alergias</h2>
            <ul>
              {antecedente?.alergias?.length > 0 ? (
                antecedente?.alergias?.map((alergia, index) => (
                  <li key={index}>{alergia}</li>
                ))
              ) : (
                <p>No hay alergias</p>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p>No hay antecedentes disponibles.</p>
      )}
    </div>
  );
}

export default Antecedentes;
