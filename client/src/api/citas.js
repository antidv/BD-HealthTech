import axios from "./axios";

export const getDataProgramarCita = async (idconsultorio_posta) => {
  const { data } = await axios.get(
    `/consultorio-medicos/${idconsultorio_posta}`
  );
  return data;
};

export const createProgracionCita = async (data) => {
  const respone = await axios.post(`/programacion-cita`, data);
  return respone.data;
};

export const getHorarios = async () => {
  const { data } = await axios.get("/horarios");
  return data;
};
