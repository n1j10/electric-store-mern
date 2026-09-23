import axios from "axios";

function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_URL;

  if (!configuredBaseUrl) {
    return "http://localhost:5000/api";
  }

  const trimmedBaseUrl = configuredBaseUrl.replace(/\/+$/, "");
  return /\/api$/i.test(trimmedBaseUrl) ? trimmedBaseUrl : `${trimmedBaseUrl}/api`;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl()
});

export default api;
