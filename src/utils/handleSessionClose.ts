const LOUGOUT_REDIRECT_URL = "../../mifin/userAuthAction.do?dispatchMethod=logout";

const handleSessionClose = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = LOUGOUT_REDIRECT_URL;
};

export { handleSessionClose };
