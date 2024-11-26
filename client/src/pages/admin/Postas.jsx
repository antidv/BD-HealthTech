import CardPosta from "../../components/CardPosta";
import postas from "../../json/postas.json";

function Postas() {
  return (
    <>
      <h1>Postas</h1>
      {postas.map((posta) => (
        <CardPosta
          key={posta.idposta}
          foto={posta.foto}
          nombre={posta.nombre}
          ciudad={posta.ciudad}
          direccion={posta.direccion}
        />
      ))}
    </>
  );
}

export default Postas;
