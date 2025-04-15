import axios from "axios";

const base_url = "http://localhost:3000";
const instance = axios.create({ baseURL: base_url });

export const restCall = async <T>({
  url,
  method = "GET",
  data = null,
  auth = false,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  auth?: boolean;
}): Promise<{ data: T | null; error: string | null }> => {
  try {
    let token: string | null = null;

    if (auth) {
      const stored = localStorage.getItem("user");
      try {
        token = stored ? JSON.parse(stored).token : null;
      } catch {
        token = null;
      }
    }

    const headers = {
      ...{ "Content-Type": "application/json" },
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await instance({ url, method, data, headers });
    return { data: response.data as T, error: null };
  } catch (error: any) {
    return { data: null, error: error.response?.data || error.message };
  }
};
