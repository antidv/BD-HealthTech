import axios from "./axios";

export const getPacienteLogeado = async () => {
  const { data } = await axios.get("/perfil_paciente");
  return data;
};
