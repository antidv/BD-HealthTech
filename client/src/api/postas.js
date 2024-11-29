import axios from "./axios";

export const getPostasAdmin = async ({ queryKey }) => {
  // Descomponer desde el 2° elemento del query
  const [{ page, limit }] = queryKey.slice(1);
  const { data } = await axios.get("/postas", {
    params: { page, limit },
  });
  return data;
};
