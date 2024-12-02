import axios from "./axios";

export const getPacienteLogeado = async () => {
  const { data } = await axios.get("/perfil_paciente");
  return data;
};

export const getAntecedentesPaciente = async () => {
  const { data } = await axios.get("/antecedentes");
  return data;
};
