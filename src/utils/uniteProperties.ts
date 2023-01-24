/* eslint-disable @typescript-eslint/no-explicit-any */

export function uniteProperties(oldObject: any = {}, newObject: any = {}) {
  if (typeof oldObject !== "object" || typeof newObject !== "object") {
    return newObject;
  }

  const objectScheme = { ...oldObject, ...newObject };

  return Object.entries(objectScheme).reduce(
    (prev, [key]: [string, any]) => {
      let oldValue: any = undefined;

      if (Object.getOwnPropertyNames(oldObject).includes(key)) {
        oldValue = oldObject[key];
      }

      let newValue: any = undefined;

      if (Object.getOwnPropertyNames(newObject).includes(key)) {
        newValue = newObject[key];
      }

      const oldIsObject = typeof oldValue === "object";
      const newIsObject = typeof newValue === "object";

      const newIsUndefined = typeof newValue === "undefined";

      if (oldIsObject && newIsObject) {
        prev[key] = uniteProperties(oldValue, newValue);
      } else if (oldIsObject && !newIsObject && !newIsUndefined) {
        prev[key] = newValue;
      } else if (!oldIsObject && newIsObject) {
        prev[key] = newValue;
      } else if (!newIsUndefined) {
        prev[key] = newValue;
      } else {
        prev[key] = oldValue;
      }

      return prev;
    },
    {
      ...objectScheme,
    } as any
  );
}
