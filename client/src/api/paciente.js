import axios from "./axios";

export const getPacienteLogeado = async () => {
  const { data } = await axios.get("/perfil_paciente");
  return data;
};

export const getAntecedentesPaciente = async () => {
  const { data } = await axios.get("/antecedentes");
  return data;
};

export const getCitaPaciente = async (idcita) => {
  const { data } = await axios.get(`/citas_paciente/${idcita}`);
  return data;
};

export const getPerfilPacienteId = async (idpaciente) => {
  const { data } = await axios.get(`/ver_paciente/${idpaciente}`);
  return data;
};
