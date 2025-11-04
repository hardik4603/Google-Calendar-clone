import API_URL from "../config/apiConfig.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const useCustomToast = () => {
  return (message, title = "Info", type = "info") => {
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    alert(message);
  };
};

const useApi = () => {
  const showToast = useCustomToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const request = async (
    endpoint,
    method = "GET",
    body = null,
    isFormData = false,
    isAuth = false
  ) => {
    try {
      const headers = {};

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${API_URL}/api${endpoint}`, {
        method,
        credentials: isAuth ? "include" : "same-origin",
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : null,
      });

      if (res.status === 401) {
        logout();
        showToast("Session expired. Please log in again.", "Error", "error");
        navigate("/login");
        return null;
      }

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Something went wrong", "Error", "error");
        return null;
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      showToast("Network error. Please try again.", "Error", "error");
      return null;
    }
  };

  return request;
};

export default useApi;