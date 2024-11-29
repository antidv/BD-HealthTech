import axios from "./axios";

export const getMedicosAdmin = async ({ queryKey }) => {
  const [{ page, limit }] = queryKey.slice(1);
  const { data } = await axios.get("/medicos", {
    params: { page, limit },
  });
  return data;
};
