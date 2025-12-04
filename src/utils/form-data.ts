export function toFormData(data: Record<string, any>) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}

function buildFormData(
  formData: FormData,
  data: Record<string, any>,
  parentKey?: string
) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof Blob)
  ) {
    Object.keys(data).forEach(key => {
      buildFormData(
        formData,
        data[key],
        parentKey
          ? !isNaN(+key)
            ? `${parentKey}[${key}]`
            : `${parentKey}.${key}`
          : key
      );
    });
  } else if (parentKey) {
    const value = data instanceof Date ? data.toString() : data;
    formData.append(parentKey, value);
  }
}
