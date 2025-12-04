const Rem = (pxValue: number, baseUnit = 16) => {
  const result = (pxValue / baseUnit).toString() + "rem";
  return result;
};

const Em = (pxValue: number, baseUnit = 16) => {
  const result = (pxValue / baseUnit).toString() + "em";
  return result;
};

export { Rem, Em };
