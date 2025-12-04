import { LoanItem } from "@mifin/Interface/NewLead";

export const getUniqueCombinations = (
  data: LoanItem[]
): { label: string; value: string }[] => {
  const uniqueCombinations: { [code: string]: string } = {};

  data.forEach(item => {
    const { purposeOfLoanId, purposeOfLoanName } = item;
    uniqueCombinations[purposeOfLoanId] = purposeOfLoanName;
  });

  return Object.entries(uniqueCombinations).map(([code, name]) => ({
    label: name,
    value: code,
  }));
};
