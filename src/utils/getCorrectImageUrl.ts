export const getCorrectImageUrl = (url: string) => {
    const hostName = window.location.hostname;
    const isLocalHost =
      hostName === "localhost" || hostName === "127.0.0.1" || hostName === "";
  
    return isLocalHost ? url : `/mifinLead/${url}`;
  };
  
  // <img src={getCorrectImageUrl(abc)}
  