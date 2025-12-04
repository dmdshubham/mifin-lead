import * as Yup from "yup";
import i18next from "i18next";

export const ContactYupSchema = (t: typeof i18next.t) => {
  return Yup.object().shape({
    potential: Yup.mixed().required(t("messages.potential")),
    //remarks: Yup.string().required(t("messages.remarks")),
    action: Yup.mixed().required(t("messages.action")),
    followupAction: Yup.mixed().required(t("messages.followupaction")),
    leadStage: Yup.mixed().required(t("messages.leadStage")),
  });
};

export const escalatedLeadYupSchema = (t: typeof i18next.t) => {
  return Yup.object().shape({
    resolve: Yup.boolean().oneOf([true], t("messages.resolveRequired")),
    resolvedRemarks: Yup.mixed().required(t("messages.resolveRemarks")),
  });
};
