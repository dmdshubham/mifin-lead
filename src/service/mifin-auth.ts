import { toastFail } from "@mifin/components/Toast";
import { AxiosError } from "axios";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { api, MifinResponse } from "./service-api";
import { MifinHttpClient } from "./service-axios";
import TokenService, { MifinTokenDetails, TokenDetails } from "./service-token";

// export interface LoginDetails {
//   workspace: string;
//   workspaceDataId: string;
//   username: string;
//   password: string;
// }

// type MifinUserTokenDetails = MifinTokenDetails & {
//   isClient: boolean;
//   isVendor: boolean;
//   isGateway: boolean;
// };

// export const authTokenKey = "authToken";
// const authTokenDetails = "authTokenDetails";

// const initLogout = (queryClient: QueryClient) => {
//   try {
//     queryClient.setQueryData(authTokenKey, () => false);
//     TokenService.clearToken();
//     return Promise.resolve(true);
//   } catch (error) {
//     return Promise.resolve(false);
//   }
// };

// const useLogoutMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation(() => initLogout(queryClient), {
//     onSuccess: () => {
//       queryClient.clear();
//       toastSuccess("Logged out Succesfully");
//     },
//   });
// };

// const initLogin = (loginData: any) => {
//   return MifinHttpClient.post<TokenDetails>(api.login, loginData);
// };

// const useLoginMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation(initLogin, {
//     onSuccess: ({ data }: any) => {

//       const tokens = {
//         // access_token: data.token,
//         access_token: "",
//         // refresh_token: response.data.refresh_token,
//       };

//       if(data.statusInfo.statusCode === "200" && data.token){
//         tokens.access_token = data.token
//       }

//       else if(data.statusInfo.statusCode === "200"){
//         tokens.access_token =  Math.random().toString(36).substr(2)
//       }

//       else{
//         tokens.access_token = "";
//       }

//       tokens.access_token && TokenService.setToken(tokens);
//       tokens.access_token && queryClient.setQueryData(authTokenKey, () => true);
//     },
//     onError: error => {
//       const loginErr = error as AxiosError<{ message: string; error: string }>;
//       toastFail(
//         loginErr.response?.data?.message ??
//           loginErr.response?.data?.error ??
//           "Login failed !"
//       );
//     },
//   });
// };

// // const changePassword = (passwordDetails: any) => {
// //   return MifinHttpClient.post<MifinResponse>(
// //     api.passwordChange,
// //     passwordDetails
// //   );
// // };

// // const useChangePassword = () => {
// //   return useMutation(changePassword, {
// //     onError: () => {
// //       toastFail("Something Went Wrong");
// //     },
// //   });
// // };

// const checkAuthentication = async () => {
//   if (TokenService.isAuthenticated()) {
//     return true;
//   }
//   return null;
// };

// /**
//  * Check if user is authenticated
//  * @returns boolean
//  */
// const useAuthentication = () => {
//   const queryClient = useQueryClient();

//   return useQuery(authTokenKey, checkAuthentication, {
//     onSuccess: () => {
//       //   const tokenDetails = TokenService.getTokenDetails();
//     },
//     onError: () => {
//       if (queryClient.getQueryData(authTokenKey)) {
//         initLogout(queryClient);
//       }
//     },
//   });
// };

// const useLoginTokenDetailQuery = () => {
//   return useQuery<unknown, unknown, MifinUserTokenDetails>(authTokenDetails);
// };

// export {
//   useAuthentication,
//   useLoginMutation,
//   useLoginTokenDetailQuery,
//   useLogoutMutation,
//   // useChangePassword,
// };

export interface LoginDetails {
  workspace: string;
  workspaceDataId: string;
  username: string;
  password: string;
}

type MifinUserTokenDetails = MifinTokenDetails & {
  isClient: boolean;
  isVendor: boolean;
  isGateway: boolean;
};

export const authTokenKey = "authToken";
const authTokenDetails = "authTokenDetails";

const initLogout = (queryClient: QueryClient) => {
  try {
    queryClient.setQueryData([authTokenKey], () => false);
    TokenService.clearToken();
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
};

const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(() => initLogout(queryClient), {
    onSuccess: () => {
      queryClient.clear();
      // toastSuccess("Logged out Succesfully");
    },
  });
};

const initLogin = (loginData: any) => {
  return MifinHttpClient.post<TokenDetails>(api.login, loginData);
};

const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(initLogin, {
    onSuccess: ({ data }: any) => {
      const tokens = {
        access_token: data.token,
        // refresh_token: response.data.refresh_token,
      };

      tokens.access_token && TokenService.setToken(tokens);
      tokens.access_token &&
        queryClient.setQueryData([authTokenKey], () => true);
    },
    onError: error => {
      const loginErr = error as AxiosError<{ message: string; error: string }>;
      toastFail(
        loginErr.response?.data?.message ??
          loginErr.response?.data?.error ??
          "Login failed !"
      );
    },
  });
};

const changePassword = (passwordDetails: any) => {
  return MifinHttpClient.post<MifinResponse>(
    api.passwordChange,
    passwordDetails
  );
};

const useChangePassword = () => {
  return useMutation(changePassword, {
    onError: () => {
      toastFail("Something Went Wrong");
    },
  });
};

const checkAuthentication = async () => {
  if (TokenService.isAuthenticated()) {
    return true;
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
const useAuthentication = () => {
  const queryClient = useQueryClient();

  return useQuery([authTokenKey], checkAuthentication, {
    onSuccess: () => {
      //   const tokenDetails = TokenService.getTokenDetails();
    },
    onError: () => {
      if (queryClient.getQueryData([authTokenKey])) {
        initLogout(queryClient);
      }
    },
  });
};

const useLoginTokenDetailQuery = () => {
  return useQuery<unknown, unknown, MifinUserTokenDetails>([authTokenDetails]);
};

export {
  useAuthentication,
  useLoginMutation,
  useLoginTokenDetailQuery,
  useLogoutMutation,
  useChangePassword,
};
