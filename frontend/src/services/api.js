import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Vérifie que l'API tourne
export const getHealth = () => api.get("/health");

// Envoie une image et reçoit les détections
export const predict = (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  return api.post("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};