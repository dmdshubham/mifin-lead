import * as Yup from "yup";
import i18next from "i18next";

const SearchAndAllocateYupSchema = (
  t: typeof i18next.t,
  remainingCase: string,
  drawerData: any
) => {
  const curruntRow = remainingCase?.find((item: any) => {
    item.rowNo === drawerData.rowNo;
  });
  const maxAllocatedCase = curruntRow?.noOfCase
    ? curruntRow.noOfCase
    : drawerData.noOfCase;

  return Yup.object().shape({
    noOfCase: Yup.number()
      .typeError(t("messages.noOfCase"))
      .min(1)
      .max(parseInt(maxAllocatedCase), t("messages.notEnoughCases"))
      .required(t("messages.caseRequired")),
    allocate: Yup.mixed().required(t("messages.allocateTo")),
  });
};

export default SearchAndAllocateYupSchema;
