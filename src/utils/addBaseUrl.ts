export interface ApiInterface {
  [key: string]: string;
}

const baseURL =
  import.meta.env.VITE_APP_BACKEND_API + import.meta.env.VITE_APP_PUBLIC_URL;

export const addBaseUrl = (apiObject: ApiInterface, baseUrl: string) => {
  return Object.fromEntries(
    Object.entries(apiObject).map(([key, value]) => {
      return [key, baseUrl + value];
    })
  );
};

export const prefixBaseUrl = (apiEndPoint: string) =>
  `${baseURL}${apiEndPoint}`;
