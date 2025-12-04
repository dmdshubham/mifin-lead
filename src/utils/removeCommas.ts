export const removeCommas = (value: string | number | undefined): string => {
  const stringValue = value?.toString();
  if (!stringValue) {
    return "";
  }

  // return value?.replace(/,/g, "") ?? "";
  return stringValue?.replace(/[^0-9]/g, "");
};
