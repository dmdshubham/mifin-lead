import * as Yup from "yup";
import i18next from "i18next";

const ProductYupSchema = (t: typeof i18next.t) => {
    return Yup.object().shape(
        {
            branch: Yup.mixed().required(t("messages.branchId")),
            schemeId: Yup.mixed().required(t("messages.schemeId")),
            purposeOfLoan: Yup.mixed().required(t("messages.purposeOfLoan")),
            loanAmount: Yup.string().required(t("messages.loanAmount")),
            loanTenure: Yup.string().required(t("messages.loanTenure")),
        }
    );
}
export default ProductYupSchema;
