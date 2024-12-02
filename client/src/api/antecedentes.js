import axios from "./axios";

export const getEnfermedades = async () => {
  const { data } = await axios.get("/enfermedades");
  return data;
};

export const getMedicamentos = async () => {
  const { data } = await axios.get("/medicamentos");
  return data;
};

export const getAntecedentesFaltantesPaciente = async (idpaciente) => {
  const { data } = await axios.get(`/antecedentes-ale-enf/${idpaciente}`);
  return data;
};
