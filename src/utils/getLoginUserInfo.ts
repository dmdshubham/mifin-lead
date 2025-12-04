import { UserInfo } from "@mifin/Enum";
import { getUserId } from "@mifin/utils/sessionData";

export const userInfo = (userId: string | null = getUserId()) => {
  const userSessionData = JSON.parse(sessionStorage.getItem("userInfo") as any);
  if (userSessionData?.userName) {
    return userSessionData.userName.toUpperCase();
  }
  let userName = "";
  switch (userId) {
    case UserInfo.lmuser1:
      userName = "Lmuser 1";
      break;
    case UserInfo.lmuser2:
      userName = "Lmuser 2";
      break;
    case UserInfo.lmuser3:
      userName = "Lmuser 3";
      break;
    case UserInfo.lmuser4:
      userName = "Lmuser 4";
      break;
    case UserInfo.coluser1:
      userName = "Coluser 1";
      break;
    case UserInfo.coluser2:
      userName = "Coluser 2";
      break;
    case UserInfo.coluser3:
      userName = "Coluser 3";
      break;
    case UserInfo.coluser4:
      userName = "Coluser 4";
      break;
    case UserInfo.lpuser1:
      userName = "Lpuser1";
      break;
    default:
      userName = "";
  }

  return userName.toUpperCase();
};
