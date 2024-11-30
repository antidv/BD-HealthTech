import axios from "./axios";

export const getPostasAdmin = async ({ page, limit, search }) => {
  const { data } = await axios.get("/postas", {
    params: { page, limit, search },
  });
  return data;
};

export const createPostaConsultorios = async (data) => {
  const response = await axios.post("/consultorio-posta", data);
  return response.data;
};
