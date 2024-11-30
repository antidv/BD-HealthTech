import axios from "./axios";

export const getMedicosAdmin = async ({ page, limit, search }) => {
  const { data } = await axios.get("/medicos", {
    params: { page, limit, search },
  });
  return data;
};
