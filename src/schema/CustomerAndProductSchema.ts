
import * as Yup from "yup";
import i18next from "i18next";

export const CustomerAndProductSchema = (t: typeof i18next.t) =>
  Yup.object().shape({
    branchId:     Yup.mixed().required(t("messages.branchId")),
    productId:    Yup.mixed().required(t("messages.product")),           
    schemeId:     Yup.mixed().required(t("messages.schemeId")),
    puposeOfLoan: Yup.mixed().required(t("messages.purposeOfLoan")),   
    loanAmount:   Yup.string().required(t("messages.loanAmount")),
    loanTenure:   Yup.string().required(t("messages.loanTenure")),
    EMI:          Yup.string().required(t("messages.emi")),    
  });
