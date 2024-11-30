import axios from "./axios";

export const getConsultorios = async () => {
  const { data } = await axios.get("/consultorios");
  return data;
};
