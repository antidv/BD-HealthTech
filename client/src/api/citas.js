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

export const getProgracionCitas = async ({ page, limit, nombre, fecha }) => {
  const { data } = await axios.get("/programacion-cita", {
    params: { page, limit, nombre, fecha },
  });
  return data;
};

export const deleteProgramacionCita = async (idprogramacion_cita) => {
  const response = await axios.delete(
    `/programacion-cita/${idprogramacion_cita}`
  );
  return response.data;
};
