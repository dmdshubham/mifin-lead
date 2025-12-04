import * as Yup from "yup";
import i18next from "i18next";

const KeyContactSchema = (t: typeof i18next.t) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(t("messages.invalidEmail"))
      .required(t("messages.email")),
    mobile: Yup.string()
      .required(t("messages.mobileNo1"))
      .matches(/^\d{10}$/, t("messages.mobileNoInvalid")),
  });
};
export default KeyContactSchema;

