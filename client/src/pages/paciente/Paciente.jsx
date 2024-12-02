import CardPaciente from "../../components/cards/CardPaciente";
import { Link } from "react-router-dom";
import { getPacienteLogeado } from "../../api/paciente";
import { getCitasPacienteLogeado } from "../../api/citas";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";

function Paciente() {
  const { page, setPage } = usePagination();
  // Peticion de datos de paciente
  const {
    data: paciente,
    isLoading: isPLoad,
    isError: isPError,
  } = useQuery({
    queryKey: ["paciente"],
    queryFn: getPacienteLogeado,
  });

  // Peticion de citas de paciente
  const {
    data: citas,
    isLoading: isCitaLoad,
    isError: isCitaError,
  } = useQuery({
    queryKey: ["citas", { page, limit: 10 }],
    queryFn: () => getCitasPacienteLogeado({ page, limit: 10 }),
  });

  if (isPLoad || isCitaLoad)
    return <Loading nombre="perfil paciente y citas ..." />;
  if (isPError || isCitaError)
    return <ErrorPage code={500} message={"Ocurrió un error"} />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-4 justify-content-center">
            <CardPaciente
              nombre={
                paciente.nombre +
                " " +
                paciente.apellidoP +
                " " +
                paciente.apellidoM
              }
              genero={paciente.genero}
              fecha_nacimiento={paciente.fecha_nacimiento}
              dni={paciente.dni}
              direccion={paciente.direccion}
              ciudad={paciente.ciudad}
            />
          </div>
          <div className="col-8">
            <div className="table-responsive mt-5 me-5">
              <h2 className="mb-4">Mis citas</h2>
              <table class="table table-info table-bordered">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Hora</th>
                    <th scope="col">Cupo</th>
                    <th scope="col">Motivo</th>
                    <th scope="col">Consultorio</th>
                    <th scope="col">Médico</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {citas?.data?.length === 0 ? (
                    <p>No hay citas para mostrar</p>
                  ) : (
                    citas?.data?.map((cita) => (
                      <tr key={cita.idcita}>
                        <th scope="row">{cita.fecha}</th>
                        <td>{cita.hora_aprox}</td>
                        <td>{cita.num_cupo}</td>
                        <td>{cita.motivo}</td>
                        <td>{cita.consultorio}</td>
                        <td>{cita.medico}</td>
                        <td>{cita.estado}</td>
                        <td>
                          <Link
                            to={`/paciente/citas/${cita.idcita}`}
                            className={`btn btn-primary ${
                              cita.estado === "Atendido" ? "" : "disabled"
                            }`}
                          >
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Paginacion */}
            <Pagination
              currentPage={page}
              totalPages={citas.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Paciente;
