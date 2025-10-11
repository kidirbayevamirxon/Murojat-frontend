import axios from "axios";

// 🧩 .env faylda bo'lishi kerak:
// VITE_BASE_URL=https://api.sening-domen.uz

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Ngrok bilan test qilganda xatolik chiqmasligi uchun
  },
});

// 🧠 So‘rov jo‘natilishidan oldin tokenni headerga qo‘shish
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 401 (Unauthorized) bo‘lsa, tokenni yangilashga urinish
axiosInstance.interceptors.response.use(
  (response) => response, // agar muvaffaqiyatli bo‘lsa, javobni qaytarish
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("401 xatolik aniqlangan, tokenni yangilashga urinish...");
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Refresh token topilmadi");

        // ⚠️ Bu joyda BASE_URL ishlatiladi (process.env o‘rniga import.meta.env)
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // Yangi tokenni headerga qo‘shish
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Asl so‘rovni qayta yuborish
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token yangilash xatolik:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 🚪 Tizimdan chiqish funksiyasi
export function logoutUser() {
  console.log("Foydalanuvchi tizimdan chiqmoqda...");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.replace("/login");
}
