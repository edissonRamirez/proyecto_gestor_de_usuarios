import axios from "axios";

// Lista de rutas que no deben ser interceptadas
const EXCLUDED_ROUTES = ["/auth/signin", "/auth/register"];

// Crear instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base de la API
  headers: { "Content-Type": "application/json" },
});

// ============================
// 🔹 Lógica del conteo de palabras
// ============================

// Obtener la lista de palabras del localStorage
const getTrackedWords = (): string[] => {
  try {
    const stored = localStorage.getItem("userKeywords");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Obtener o inicializar el diccionario de conteos
const getScores = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem("scores");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Guardar el diccionario actualizado en localStorage
const saveScores = (scores: Record<string, number>) => {
  localStorage.setItem("scores", JSON.stringify(scores));
};

// ============================
// 🔹 Interceptor de solicitud
// ============================
api.interceptors.request.use(
  (request) => {
    console.log("Interceptando solicitud a:", request.url);

    // Si la URL está en las rutas excluidas, se omite
    if (EXCLUDED_ROUTES.some((route) => request.url?.includes(route))) {
      return request;
    }

    // Obtener el token del usuario autenticado
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    // ============================
    // 🧠 Analizar la URL con las palabras rastreadas
    // ============================
    const trackedWords = getTrackedWords();
    const scores = getScores();

    if (request.url) {
      trackedWords.forEach((word) => {
        if (request.url?.toLowerCase().includes(word.toLowerCase())) {
          scores[word] = (scores[word] || 0) + 1;
          console.log(`📈 Incrementando contador de "${word}" → ${scores[word]}`);
        }
      });
      saveScores(scores);
    }

    return request;
  },
  (error) => Promise.reject(error)
);

// ============================
// 🔹 Interceptor de respuesta
// ============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("⚠️ No autorizado, redirigiendo a login...");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
