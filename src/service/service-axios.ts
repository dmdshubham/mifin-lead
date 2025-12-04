import { getCurrentUserInfo, getUserLoginId } from "@mifin/utils/sessionData";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
// import TokenService from "@mifin/service/service-token";
import * as CryptoJS from "crypto-js";

const baseUrl = `${import.meta.env.VITE_APP_BACKEND_API}${
  import.meta.env.VITE_APP_BACKEND_API
}`;
const url = `${import.meta.env.VITE_APP_BACKEND_API}`;

/**
 * Axios HTTP Client
 * {@link https://github.com/axios/axios#request-config Axios Request Config}
 */

const THREE_MINUTES = 3 * 60 * 1000;

const MifinHttpClient = axios.create({
  baseURL: baseUrl,
  timeout: THREE_MINUTES,
});

/**
 * Pass security options and API Key in Header
 */
// MifinHttpClient.interceptors.request.use(async config => {
//   const token = TokenService.getToken()?.access_token;

//   if (config && config.headers) {
//     if (token) {
//       config.headers["Authorization"] = "Bearer " + token;
//     }
//   }
//   return config;
// });

const refreshAuthLogic = async failedRequest => {
  try {
        const userLoginId = getUserLoginId();
    const userName = userLoginId?.trim().toUpperCase();

    const jwt2 = sessionStorage.getItem("jwt2");

    const response = await axios.get(
      `${url}/mifin/JwtTokenRefresherServlet?userId=${userName}&jwtToken=${jwt2}`
    );
    const { shortTermToken, longTermToken } = response.data;

    sessionStorage.setItem("jwt", shortTermToken);
    sessionStorage.setItem("jwt2", longTermToken);

    failedRequest.response.config.headers[
      "Authorization"
    ] = `Bearer ${shortTermToken}`;
    return Promise.resolve();
  } catch (error) {
    console.error("Token refresh failed", error);
    if (error.response && error.response.status === 401) {
      //  handleSessionClose();
    }
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(MifinHttpClient, refreshAuthLogic, {
  statusCodes: [401],
});

const eSignHttpClient = axios.create({
  baseURL: baseUrl,
  timeout: 3000,
});

const addJwtToken = async config => {
  const token: string | null = sessionStorage.getItem("jwt");
  const jwt = `Bearer ${token}`;
  if (!config._payloadHash) {
    const payload = JSON.stringify(config.data);
    config._payloadHash = CryptoJS.HmacSHA256(
      payload,
      import.meta.env.VITE_API_KEY
    ).toString();
  }
  config.headers = config.headers || {};
  config.headers["Authorization"] = jwt;
  config.headers["X-Payload-Hash"] = config._payloadHash;

  return config;
};

eSignHttpClient.interceptors.request.use(async config => addJwtToken(config));
MifinHttpClient.interceptors.request.use(async config => addJwtToken(config));

// Add response interceptor to handle offline errors gracefully
MifinHttpClient.interceptors.response.use(
  response => response,
  error => {
    // Check if it's a network error (offline)
    if (!navigator.onLine || error.message === 'Network Error' || !error.response) {
      console.log('Network request failed - user is offline');
      // Don't show error toast when offline - PWA will handle it
      return Promise.reject({ ...error, suppressToast: true });
    }
    return Promise.reject(error);
  }
);

eSignHttpClient.interceptors.response.use(
  response => response,
  error => {
    if (!navigator.onLine || error.message === 'Network Error' || !error.response) {
      console.log('Network request failed - user is offline');
      return Promise.reject({ ...error, suppressToast: true });
    }
    return Promise.reject(error);
  }
);

export { MifinHttpClient, eSignHttpClient };
