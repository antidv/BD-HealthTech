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

export const getDatosActualizarMedico = async (idmedico) => {
  const { data } = await axios.get(`/especialidad-consultorio/${idmedico}`);
  return data;
};

export const updateMedico = async (idmedico, data) => {
  const response = await axios.put(`/medicos/${idmedico}`, data);
  return response.data;
};

export const toggleMedicoConsultorioPosta = async (idmedconposta) => {
  const response = await axios.put(
    `/medico-consultorio-posta/${idmedconposta}`
  );
  return response.data;
};

export const getPerfilMedico = async () => {
  const { data } = await axios.get("/perfil_medico");
  return data;
};

export const getCitaMedico = async (idcita) => {
  const { data } = await axios.get(`/citas_medico/${idcita}`);
  return data;
};

export const cambiarEstadoMedico = async (idmedico) => {
  const response = await axios.put(`/medicos-disponible/${idmedico}`);
  return response.data;
};

export const getConsultoriosMedicoLog = async () => {
  const { data } = await axios.get("/medico-consultorio");
  return data;
}