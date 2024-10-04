// apiInterceptor.js
import axios from "axios";

const BASE_URL = "http://localhost:5004/api";

// axios instance for auth-related calls (no interceptor)
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// main API instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = (refreshToken, handleLogout) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await refreshToken();

          if (res) {
            const newToken = res.accessToken;
            api.defaults.headers.common["Authorization"] = "Bearer " + newToken; // Set new token
            processQueue(null, newToken);
            return api(originalRequest); // Retry the failed request with new token
          } else {
            processQueue(new Error("Failed to refresh token"), null);
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          await handleLogout();
          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 403) {
        await handleLogout();
        return Promise.reject(
          new Error("Invalid session. Please log in again.")
        );
      }

      return Promise.reject(error);
    }
  );
};
