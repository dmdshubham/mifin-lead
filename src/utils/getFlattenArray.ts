import isObject from "@mifin/utils/isObject";

const getFlattenArray = (obj: any) => {
  const data = structuredClone(obj);

  Object.keys(data).forEach(item => {
    if (Array.isArray(data[item])) {
      const values = data[item].map((item2: any) => item2.value);
      const result = values.join(",");
      return (data[item] = result);
    }
    if (isObject(data[item])) {
      const values = data[item].value;
      return (data[item] = values);
    }
  });

  return data;
};

export default getFlattenArray;
