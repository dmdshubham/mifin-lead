/**
 * Remove empty, null and undefined values
 * @param obj a record of key value pair
 * @returns a record that does not have empty, null or undefined values
 */
export function filterFalseyValues<T>(obj: Record<string, any>) {
  for (const propName in obj) {
    if (["", null, undefined].includes(obj[propName])) {
      delete obj[propName];
    } else if (
      obj[propName] instanceof Object &&
      Object.keys(obj[propName]).length
    ) {
      obj[propName] = filterFalseyValues(obj[propName]);
    }
  }
  return obj as T;
}
