import * as Yup from "yup";
import i18next from "i18next";

const LeadSearchYupSchema =
  (t: typeof i18next.t) => {
    return Yup.object().shape({
      leadSearchId: Yup.string()
        .required(t("messages.leadSearchId"))
        // .matches(/^[PR pr]/, (t("messages.startWithPr")))
        .min(10, (t("messages.minTen")))
    });
  };

export default LeadSearchYupSchema;
