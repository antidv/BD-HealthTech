import CardPosta from "../../components/CardPosta";
import postas from "../../json/postas.json";
import styles from "../../pages/principal.module.css";

function Postas() {
  return (
    <>
      <div className={`container-fluid ${styles.containerColor}`}>
        <div className="row align-items-center justify-content-center" >
          <div className="col-12">
            <h2 className="mt-4 ms-3">Postas</h2>
          </div>
        </div>
        <div className="row m-3">
          {postas.map((posta) => (
              <CardPosta
                key={posta.idposta}
                foto={posta.foto}
                nombre={posta.nombre}
                ciudad={posta.ciudad}
                direccion={posta.direccion}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Postas;
