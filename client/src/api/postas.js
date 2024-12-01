import axios from "./axios";

export const getPostasAdmin = async ({ page, limit, search, city }) => {
  const { data } = await axios.get("/postas", {
    params: { page, limit, search, city },
  });
  return data;
};

export const getPosta = async (idposta) => {
  const { data } = await axios.get(`/postas/${idposta}`);
  return data;
};

export const createPostaConsultorios = async (data) => {
  const response = await axios.post("/consultorio-posta", data);
  return response.data;
};

export const updateConsultoriosPosta = async (idposta, data) => {
  const response = await axios.put(`/consultorio-posta/${idposta}`, data);
  return response.data;
};
