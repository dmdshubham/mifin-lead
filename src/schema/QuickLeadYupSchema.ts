import * as Yup from "yup";
import i18next from "i18next";

const quickLeadschema = (t: typeof i18next.t) => {
  return Yup.object().shape({
    firstName: Yup.string().required(t("messages.firstName")),
    lastName: Yup.string().required(t("messages.lastName")),
    email: Yup.string()
      .required(t("messages.email"))
      .email(t("messages.invalidEmail")),
    mobile_no2: Yup.string()
      .matches(/^[6789]\d{9}$/, t("messages.phoneNo"))
      .matches(/^\d{10}$/, t("messages.enterTenDigit")),
    queueId: Yup.mixed().required(t("messages.product")),
    source: Yup.mixed().required(t("messages.source")),
    campaign: Yup.mixed().required(t("messages.campaign")),
    allocateTo: Yup.mixed().required(t("messages.allocate")),
    potential: Yup.mixed().required(t("messages.potential")),
  });
};
export default quickLeadschema;
