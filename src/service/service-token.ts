export interface TokenDetails {
  access_token: string;
}

export enum Authorities {
  "gateway" = "gateway",
  "vendor" = "vendor",
  "client" = "client",
}

export interface MifinTokenDetails {
  contactNo: string;
  email: string;
  id: null | number;
  name: string;
  profilePic: string;
  role: string;
  roleId: null | number;
  schemeBased: boolean;
  username: string;
  workspace: Authorities;
  exp: number;
  workspacedataid: number;
}

function setToken(token: TokenDetails) {
  try {
    sessionStorage.setItem("auth", JSON.stringify(token));
  } catch (e) {
    console.error("Error storing token", e);
  }
}

function getToken() {
  try {
    return JSON.parse(sessionStorage.getItem("auth") || "") as TokenDetails;
  } catch (e) {
    return null;
  }
}

function getTokenDetails(): MifinTokenDetails | null {
  try {
    const token = getToken();
    return token
      ? (JSON.parse(
          window.atob(token.access_token.split(".")[1])
        ) as MifinTokenDetails)
      : null;
  } catch (e) {
    return null;
  }
}

function isAuthenticated() {
  const tokenDetails = getTokenDetails();
  if (tokenDetails) {
    return tokenDetails.exp * 1000 > Date.now();
  } else {
    return false;
  }
}

function checkRBAC(authorities: Authorities[]) {
  const tokenDetails = getTokenDetails();
  if (tokenDetails) {
    return authorities.find(auth => auth === tokenDetails.workspace);
  } else {
    return false;
  }
}

function clearToken() {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("userLoginId");
  localStorage.removeItem("user-info");
}

export const getRole = () => {
  return getTokenDetails()?.workspacedataid;
};

const TokenService = {
  setToken,
  getToken,
  getTokenDetails,
  isAuthenticated,
  checkRBAC,
  clearToken,
};

export default TokenService;
