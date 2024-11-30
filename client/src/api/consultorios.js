import axios from "./axios";

export const getConsultorios = async () => {
  const { data } = await axios.get("/consultorios");
  return data;
};

export const getConsultoriosPosta = async ({ idposta, page, limit }) => {
  const { data } = await axios.get(`/consultorio-posta/${idposta}`, {
    params: { page, limit },
  });
  return data;
};
