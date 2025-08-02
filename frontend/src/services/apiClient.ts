// frontend/src/services/apiClient.ts
import axios from "axios";
import { supabase } from "../supabaseClient";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add an interceptor to include the authorization header on every request
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

export default apiClient;
