import axios, { AxiosRequestHeaders } from "axios";

let getToken: () => string | null = () => null;
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (error: any) => void;
}[] = [];

export const setTokenGetter = (fn: () => string | null) => {
  getToken = fn;
};

const axiosClient = axios.create({
  baseURL: (
    `${process.env.NEXT_PUBLIC_API_URL}/v1` || "http://localhost:10000/v1"
  ).replace(/\/$/, ""),
  withCredentials: false,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken?.();
    config.headers = config.headers ?? {};

    if (token) {
      (config.headers as AxiosRequestHeaders)[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAccessTokenExpired =
      error.response?.data?.errorCode === "TOKEN_EXPIRED" ||
      error.response?.data?.errorCode === "INVALID_TOKEN";
    const isRefreshTokenInvalidOrRevoked =
      error.response?.data?.errorCode === "EXPIRED_REFRESH_TOKEN" ||
      error.response?.data?.errorCode === "REVOKED_REFRESH_TOKEN" ||
      error.response?.data?.errorCode === "INVALID_REFRESH_TOKEN";
    if (isAccessTokenExpired && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, queue request lại
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            if (isRefreshTokenInvalidOrRevoked) {
              if (typeof logoutCallback === "function") {
                logoutCallback();
              }
            }
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;

        if (typeof updateTokenCallback === "function") {
          updateTokenCallback(newAccessToken);
        }

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return axiosClient(originalRequest);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        processQueue(err, null);
        if (err.response?.status === 401) {
          if (typeof logoutCallback === "function") {
            logoutCallback();
          }
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (isRefreshTokenInvalidOrRevoked && !originalRequest._retry) {
      if (typeof logoutCallback === "function") {
        logoutCallback();
      }
    }

    return Promise.reject(error);
  }
);

let updateTokenCallback: ((token: string) => void) | null = null;
let logoutCallback: (() => void) | null = null;

export const setUpdateTokenCallback = (fn: (token: string) => void) => {
  updateTokenCallback = fn;
};

export const setLogoutCallback = (fn: () => void) => {
  logoutCallback = fn;
};

export default axiosClient;
