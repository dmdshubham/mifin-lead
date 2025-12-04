import { FC } from "react";
import useSetLanguage from "@mifin/pages/App/hook/useSetLanguage";
import useSetCurrentPathName from "@mifin/pages/App/hook/useSetCurrentPathName";
import useSetBusinessDate from "@mifin/pages/App/hook/useSetBusinessDate";
import useSetDefaultUserInfo from "@mifin/pages/App/hook/useSetDefaultUserInfo";

/*
 components is only used to call and set the data before login
*/

const PrepareLogin: FC = () => {
  useSetLanguage();
  useSetCurrentPathName();
  useSetBusinessDate();
  useSetDefaultUserInfo();

  return null;
};

export default PrepareLogin;
