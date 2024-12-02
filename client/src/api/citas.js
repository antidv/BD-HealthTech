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

// Citas paciente Logeado
export const getCitasPacienteLogeado = async ({ page, limit }) => {
  const response = await axios.get("/citas_paciente", {
    params: { page, limit },
  });
  return response.data;
};

export const getProgramacionCitasPaciente = async ({
  page,
  limit,
  idconsultorio,
  fecha,
}) => {
  const response = await axios.get("/programacioncita-ciudad", {
    params: { page, limit, idconsultorio, fecha },
  });
  return response.data;
};

export const getDataCreateCitaPaciente = async (idprogramacion_cita) => {
  const response = await axios.get(`/programacion-cita/${idprogramacion_cita}`);
  return response.data;
};

export const createCitaPaciente = async (data) => {
  const respone = await axios.post(`/citas`, data);
  return respone.data;
};

export const getCitasMedico = async ({ page, limit }) => {
  const response = await axios.get("/citas_medico", {
    params: { page, limit },
  });
  return response.data;
};

export const updateCitaMedico = async (idcita, data) => {
  const response = await axios.put(`/citas/${idcita}`, data);
  return response.data;
};

export const createDiagnosticoCita = async (idcita, data) => {
  const response = await axios.post(`/diagnostico/${idcita}`, data);
  return response.data;
};

export const getProgramacionCitaMedico = async ({ page, limit, nombre, fecha }) => {
  const response = await axios.get("/programacion-cita-medico", {
    params: { page, limit, nombre, fecha },
  });
  return response.data;
}