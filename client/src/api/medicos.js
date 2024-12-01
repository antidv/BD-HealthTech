import axios from "./axios";

export const getMedicosAdmin = async ({ page, limit, search }) => {
  const { data } = await axios.get("/medicos", {
    params: { page, limit, search },
  });
  return data;
};

export const createMedico = async (data) => {
  const respones = await axios.post("/medicos", data);
  return respones.data;
};

export const getMedico = async (idmedico) => {
  const { data } = await axios.get(`/medicos/${idmedico}`);
  return data;
};

export const getEspecialidades = async () => {
  const { data } = await axios.get("/especialidades");
  return data;
};
