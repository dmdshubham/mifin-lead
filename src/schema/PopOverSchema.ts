import * as Yup from "yup";
import i18next from "i18next";

const PopOverSchema = (t: typeof i18next.t) => {
    return Yup.object().shape(
        {
            allocateTo: Yup.mixed().required(t("messages.allocateTo")),
            remarks: Yup.string().required(t("messages.remarks"))
        }
    );
}
export default PopOverSchema;

