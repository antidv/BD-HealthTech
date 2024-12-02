import CardMedicoVistaM from "../../components/cards/CardMedicoVistaM";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPerfilMedico } from "../../api/medicos";
import { getCitasMedico } from "../../api/citas";
import Pagination from "../../components/Pagination";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import usePagination from "../../hooks/usePagination";

function MedicoPrincipal() {
  const { page, setPage } = usePagination();

  // Peticion del perfil medico
  const {
    data: medico,
    isLoading: isMedLoad,
    isError: isMedError,
  } = useQuery({
    queryKey: ["medico"],
    queryFn: getPerfilMedico,
  });

  // Peticion de citas del medico
  const {
    data: citas,
    isLoading: isCitaLoad,
    isError: isCitaError,
  } = useQuery({
    queryKey: ["citas", { page, limit: 10 }],
    queryFn: () => getCitasMedico({ page, limit: 10 }),
  });

  if (isMedLoad || isCitaLoad)
    return <Loading nombre="perfil medico y citas ..." />;
  if (isMedError || isCitaError)
    return <ErrorPage code={500} message={"Ocurrió un error"} />;

  return (
    <>
      <div className="container-fluid containerColor">
        <div className="row justify-content-center">
          <div className="col-4 justify-content-center">
            {/* Dato de medico */}
            <CardMedicoVistaM
              nombre={
                medico.nombre + " " + medico.apellidoP + " " + medico.apellidoM
              }
              foto={medico.foto}
              especialidad={medico.especialidad}
              dni={medico.dni}
              disponible={medico.disponible}
            />
          </div>
          <div className="col-8">
            <div className="row mt-2 me-5">
              <div className="col-12">
                <div className="table-responsive mt-5 me-5">
                  <h2 className="mb-4">Historial de citas</h2>
                  <table className="table table-info table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Motivo</th>
                        <th scope="col">Posta</th>
                        <th scope="col">Consultorio</th>
                        <th scope="col">Paciente</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas?.data?.length === 0 ? (
                        <p>No hay citas para mostrar</p>
                      ) : (
                        citas?.data?.map((cita) => (
                          <tr key={cita.idcita}>
                            <td scope="row">{cita.fecha}</td>
                            <td>{cita.hora_aprox}</td>
                            <td>{cita.motivo}</td>
                            <td>{cita.posta_nombre}</td>
                            <td>{cita.consultorio}</td>
                            <td>
                              {cita.paciente_nombre +
                                " " +
                                cita.paciente_apellido}
                            </td>
                            <td>{cita.estado}</td>
                            <td>
                              <Link
                                to={`/medico/diagnostico/${cita.idcita}`}
                                className={`btn btn-primary ${
                                  cita.estado === "Atendido" ? "disabled" : ""
                                }`}
                              >
                                Modificar
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Paginacion  */}
                <Pagination
                  currentPage={page}
                  totalPages={citas.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MedicoPrincipal;
