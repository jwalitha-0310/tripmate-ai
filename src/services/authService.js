import { apiRequest, setAuthToken } from "./api";

export const registerUser = async (name, email, password) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const loginUser = async (email, password) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setAuthToken(data.token);
  return data;
};

export const logoutUser = () => {
  setAuthToken(null);
};