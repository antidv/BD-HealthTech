import axios from "./axios";

export const getConsultorios = async () => {
  const { data } = await axios.get("/consultorios");
  return data;
};

export const getConsultoriosPosta = async ({
  idposta,
  page = null,
  limit = null,
}) => {
  const { data } = await axios.get(`/consultorio-posta/${idposta}`, {
    params: { page, limit },
  });
  return data;
};

export const getConsultoriosFaltantesPosta = async (idposta) => {
  const { data } = await axios.get(`/consultorios-faltantes/${idposta}`);
  return data;
};
