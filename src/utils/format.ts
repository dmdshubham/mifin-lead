export interface IFormatSelectOptionParams {
  data: any;
  labelKey: string;
  valueKey: number | string;
}

export interface ISelectOptions<T extends number | string> {
  label: string;
  value: T;
}
export function formatSelectOptions({
  data,
  labelKey,
  valueKey,
}: IFormatSelectOptionParams) {
  return data?.map((item: any) => {
    return {
      label: item?.[labelKey],
      value: item?.[valueKey],
    };
  });
}
