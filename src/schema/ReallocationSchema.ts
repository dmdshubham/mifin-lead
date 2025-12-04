import * as Yup from "yup";
import i18next from "i18next";

const ReallocationSchema = (t: typeof i18next.t) => {
  return Yup.object().shape({
    allocatedId: Yup.mixed().required(t("messages.allocate")),
    // queueId: Yup.mixed().required(t("messages.queue")),
    remark: Yup.string().required(t("messages.remarks")),
  });
};
export default ReallocationSchema;
